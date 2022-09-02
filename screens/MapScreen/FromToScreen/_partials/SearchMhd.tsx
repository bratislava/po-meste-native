import LoadingView from '@components/LoadingView'
import BottomSheet from '@gorhom/bottom-sheet'
import SearchSvg from '@icons/search.svg'
import MhdStopSvg from '@icons/stop-sign.svg'
import { customMapStyle } from '@screens/MapScreen/customMapStyle'
import { markerLabelStyles } from '@screens/MapScreen/MapScreen/MapScreen'
import StationMhdInfo from '@screens/MapScreen/MapScreen/_partials/StationMhdInfo'
import { GlobalStateContext } from '@state/GlobalStateProvider'
import { ZoomLevel } from '@types'
import { getMhdStopStatusData } from '@utils/api'
import { s } from '@utils/globalStyles'
import { colors } from '@utils/theme'
import { getZoomLevel } from '@utils/utils'
import { MhdStopProps } from '@utils/validation'
import i18n from 'i18n-js'
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { ScrollView } from 'react-native-gesture-handler'
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { useQuery } from 'react-query'
import StopPlatformCard from './_partials/StopPlatformCard'

const MAP_HEIGHT = 200

type UniqueStop = {
  id: string
  title: string
}

const icons = {
  active: {
    xs: require('@icons/map/mhd/xs.png'),
    sm: require('@icons/map/mhd/sm.png'),
    md: require('@icons/map/mhd/md.png'),
    lg: require('@icons/map/mhd/lg.png'),
  },
  inactive: {
    xs: require('@icons/map/mhd/xs.png'),
    sm: require('@icons/map/mhd/sm.png'),
    md: require('@icons/map/mhd/md-inactive.png'),
    lg: require('@icons/map/mhd/lg-inactive.png'),
  },
}

const SearchMhd = () => {
  const globalContext = useContext(GlobalStateContext)
  const stopsData: MhdStopProps[] = globalContext.mhdStopsData?.data?.stops
  const uniqueStopNames = Array.from(
    new Set(stopsData.map((stop: MhdStopProps) => stop.name))
  )
  const uniqueStops: UniqueStop[] = uniqueStopNames.map((stopName, index) => ({
    id: index + '',
    title: stopName,
  }))
  const mapRef = useRef<MapView>(null)
  const [chosenStop, setChosenStop] = useState<UniqueStop>()
  const [suggestions, setSuggestions] = useState<UniqueStop[]>([])
  const [stopPlatforms, setStopPlatforms] = useState<MhdStopProps[]>([])
  const [region, setRegion] = useState<Region | null>({
    latitude: 48.1512015,
    longitude: 17.1110118,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const [chosenPlatform, setChosenPlatform] = useState<MhdStopProps>()

  const stopStatuses = useQuery(
    [
      'searchMhdGetMhdStopStatusData',
      stopPlatforms.length > 0 ? stopPlatforms[0].name : 'Loading',
    ],
    async () => {
      const result = await Promise.all(
        stopPlatforms.map((stop) => getMhdStopStatusData(stop.id))
      )
      return result
    }
  )

  const getIcon = (active: boolean) => {
    const iconsSubset = icons[active ? 'active' : 'inactive']
    switch (getZoomLevel(region)) {
      case ZoomLevel.xs:
        return iconsSubset.xs
      case ZoomLevel.sm:
        return iconsSubset.sm
      case ZoomLevel.md:
        return iconsSubset.md
      case ZoomLevel.lg:
        return iconsSubset.lg
      default:
        return undefined
    }
  }

  useEffect(() => {
    const chosenStopPlatforms = (
      globalContext.mhdStopsData.data?.stops as MhdStopProps[]
    )
      ?.filter((stop) => stop.name === chosenStop?.title)
      .sort((a, b) =>
        a.platform && b.platform && a.platform > b.platform ? 1 : -1
      )
    setStopPlatforms(chosenStopPlatforms)
  }, [setStopPlatforms, chosenStop, globalContext.mhdStopsData.data?.stops])

  const getCetralStopCamera = (stopPlatforms: MhdStopProps[]) => {
    let [lonSum, latSum] = [0, 0]
    let [latMin, latMax] = [Infinity, 0]
    stopPlatforms.forEach((stop) => {
      const lat = Number.parseFloat(stop.gpsLat)
      lonSum += Number.parseFloat(stop.gpsLon)
      latSum += lat
      latMin = lat < latMin ? lat : latMin
      latMax = lat > latMax ? lat : latMax
    })
    return {
      center: {
        latitude: latSum / stopPlatforms.length,
        longitude: lonSum / stopPlatforms.length,
      },
      // some stop platforms have a large lat difference and they then do not fit in the screen (e.g. Pionierska)
      // only doing this for lat since the map is wide enough to fit any occuring lon difference
      zoom: latMax - latMin < 0.0018 ? 16 : 15.5,
      altitude: 100,
    }
  }

  useEffect(() => {
    if (!stopPlatforms || stopPlatforms.length === 0) return
    mapRef.current?.animateCamera(getCetralStopCamera(stopPlatforms))
  }, [stopPlatforms])

  useEffect(() => {
    if (region && chosenPlatform) {
      mapRef.current?.animateCamera({
        center: {
          latitude: region?.latitude - region?.latitudeDelta,
          longitude: region?.longitude,
        },
        zoom: 16,
        altitude: 100,
      })
    }
  }, [chosenPlatform])

  const renderPlatforms = useCallback(() => {
    if (!stopPlatforms || stopPlatforms.length === 0) return null
    return stopPlatforms.map((stop, index) => (
      <StopPlatformCard
        key={stop.id}
        stop={stop}
        stopStatus={stopStatuses?.data ? stopStatuses.data[index] : undefined}
        onPress={() => setChosenPlatform(stop)}
      />
    ))
  }, [stopPlatforms, stopStatuses])

  const handleBottomSheetClose = () => {
    setChosenPlatform(undefined)
    if (!stopPlatforms || stopPlatforms.length === 0) return
    mapRef.current?.setCamera(getCetralStopCamera(stopPlatforms))
  }

  return (
    <View style={styles.container}>
      <View
        style={styles.mapWrapper}
        pointerEvents={chosenPlatform ? 'auto' : 'none'}
      >
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{ height: chosenPlatform ? '100%' : MAP_HEIGHT }}
          customMapStyle={customMapStyle}
          initialRegion={{
            latitude: 48.1512015,
            longitude: 17.1110118,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onRegionChangeComplete={(region) => setRegion(region)}
          showsMyLocationButton={false}
          mapPadding={{
            bottom: 0,
            top: 50,
            right: 0,
            left: 0,
          }}
        >
          {stopPlatforms &&
            stopPlatforms.map((stop) => (
              <Marker
                key={stop.id}
                coordinate={{
                  latitude: parseFloat(stop.gpsLat),
                  longitude: parseFloat(stop.gpsLon),
                }}
                tracksViewChanges={false}
                //onPress={() => operateBottomSheet({ mhd: stop })}
                icon={getIcon(
                  chosenPlatform ? stop.id === chosenPlatform?.id : true
                )}
                style={{ zIndex: stop.id === chosenPlatform?.id ? 2 : 1 }}
              >
                {stop.platform && getZoomLevel(region) === ZoomLevel.lg && (
                  <View style={markerLabelStyles.container}>
                    <Text style={markerLabelStyles.label}>{stop.platform}</Text>
                  </View>
                )}
              </Marker>
            ))}
        </MapView>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <SearchSvg
            width={20}
            height={20}
            fill={colors.mediumGray}
            style={styles.searchIcon}
          />
          <AutocompleteDropdown
            direction={Platform.select({ ios: 'down' })}
            dataSet={suggestions}
            onSelectItem={(item) => {
              item &&
                setChosenStop(uniqueStops.find((stop) => item.id === stop.id))
            }}
            onChangeText={(text) => {
              if (text.length > 1)
                setSuggestions(
                  uniqueStops.filter((stop) =>
                    stop.title
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .toLowerCase()
                      .includes(
                        text
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .toLowerCase()
                      )
                  )
                )
              else {
                setSuggestions([])
              }
            }}
            useFilter={false} // set false to prevent rerender twice
            textInputProps={{
              placeholder: i18n.t('screens.FromToScreen.SearchMhd.stopName'),
              autoCorrect: false,
              autoCapitalize: 'none',
              style: autocompleteStyles.textInput,
            }}
            rightButtonsContainerStyle={autocompleteStyles.rightButtonContainer}
            inputContainerStyle={autocompleteStyles.inputContainer}
            suggestionsListContainerStyle={{
              backgroundColor: colors.white,
            }}
            containerStyle={autocompleteStyles.container}
            renderItem={(item) => (
              <View style={{ padding: 15, flexDirection: 'row' }}>
                <MhdStopSvg
                  width={16}
                  height={16}
                  fill={colors.mediumGray}
                  style={{ marginRight: 10 }}
                />
                <Text>{item.title}</Text>
              </View>
            )}
            clearOnFocus
            onFocus={() => setSuggestions([])}
            inputHeight={50}
            showChevron={false}
            closeOnBlur={false}
            EmptyResultComponent={<View />}
          />
        </View>
        {stopPlatforms && (
          <>
            {stopStatuses.isLoading && (
              <LoadingView
                stylesOuter={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  zIndex: 2,
                }}
                iconWidth={80}
                iconHeight={80}
              />
            )}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 5,
                paddingBottom: MAP_HEIGHT + 20,
              }}
              style={{}}
            >
              {renderPlatforms()}
            </ScrollView>
          </>
        )}
      </View>
      {chosenPlatform && (
        <BottomSheet
          snapPoints={['50%', '95%']}
          handleIndicatorStyle={s.handleStyle}
          index={0}
          enablePanDownToClose
          onClose={() => handleBottomSheetClose()}
        >
          <StationMhdInfo station={chosenPlatform} />
        </BottomSheet>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    height: '100%',
  },
  mapWrapper: {},
  searchContainer: {
    backgroundColor: colors.white,
    height: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    padding: 20,
  },
  searchIcon: {
    position: 'absolute',
    zIndex: 2,
    top: 38,
    left: 40,
  },
})

const autocompleteStyles = StyleSheet.create({
  textInput: {
    backgroundColor: colors.white,
    borderRadius: 30,
    letterSpacing: 0.5,
    color: colors.black,
    paddingHorizontal: 15,
    paddingLeft: 36,
  },
  rightButtonContainer: {
    right: 8,
    height: 30,
    alignSelf: 'center',
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderRadius: 30,
    borderColor: colors.mediumGray,
    paddingHorizontal: 18,
  },
  container: { flexGrow: 1, flexShrink: 1 },
})

export default SearchMhd
