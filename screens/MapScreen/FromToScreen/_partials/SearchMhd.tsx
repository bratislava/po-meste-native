import {
  autoCompleteStyles,
  FixedGooglePlaceData,
} from '@components/Autocomplete'
import SearchSvg from '@icons/search.svg'
import MhdStopSvg from '@icons/stop-sign.svg'
import { customMapStyle } from '@screens/MapScreen/customMapStyle'
import { GlobalStateContext } from '@state/GlobalStateProvider'
import { GooglePlace } from '@types'
import { s } from '@utils/globalStyles'
import { colors } from '@utils/theme'
import { MhdStopProps } from '@utils/validation'
import Constants from 'expo-constants'
import React, { useCallback, useContext, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete'
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps'

const SearchMhd = () => {
  const globalContext = useContext(GlobalStateContext)
  const mapRef = useRef<MapView>(null)
  const inputRef = useRef<GooglePlacesAutocompleteRef>(null)
  const [chosenPlace, setChosenPlace] = useState<GooglePlace>()
  const [input, setInput] = useState('')
  const [region, setRegion] = useState<Region | null>({
    latitude: 48.1512015,
    longitude: 17.1110118,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const [googleAutocompleteSelection, setGoogleAutocompleteSelection] =
    useState<{ start: number } | undefined>(undefined)

  const renderRow = (result: GooglePlaceData) => {
    const fixedResult = result as FixedGooglePlaceData
    return (
      <View style={styles.searchResultRow}>
        <MhdStopSvg
          style={styles.searchResultRowIcon}
          fill={colors.lighterGray}
          width={16}
          height={16}
        />
        <Text>{fixedResult.structured_formatting.main_text}</Text>
      </View>
    )
  }

  const renderPlatforms = useCallback(() => {
    const stopPlatforms: MhdStopProps[] =
      globalContext.mhdStopsData.data?.stops?.filter(
        (stop: MhdStopProps) =>
          stop.name === chosenPlace?.data.structured_formatting.main_text
      )
    let [lonSum, latSum] = [0, 0]
    stopPlatforms.forEach((stop) => {
      lonSum += Number.parseFloat(stop.gpsLon)
      latSum += Number.parseFloat(stop.gpsLat)
    })
    mapRef.current?.animateCamera({
      center: {
        latitude: latSum / stopPlatforms.length,
        longitude: lonSum / stopPlatforms.length,
      },
      zoom: 16,
      altitude: 100,
    })
    return stopPlatforms
      .sort((a, b) =>
        a.platform && b.platform && a.platform > b.platform ? 1 : -1
      )
      .map((stop, index) => (
        <View
          key={index}
          style={{
            elevation: 7,
            minHeight: 100,
            ...s.roundedBorder,
            backgroundColor: colors.white,
            marginBottom: 10,
            padding: 15,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {stop.name}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: colors.mediumGray,
                marginLeft: 5,
              }}
            >
              {stop.platform}
            </Text>
          </View>
        </View>
      ))
  }, [chosenPlace, globalContext.mhdStopsData.data?.stops])

  const onGooglePlaceChosen = (
    data: GooglePlaceData,
    detail: GooglePlaceDetail | null
  ) => {
    setChosenPlace({ data, detail })
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper} pointerEvents="none">
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
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
            top: 0,
            right: 0,
            left: 0,
          }}
        ></MapView>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <GooglePlacesAutocomplete
            renderLeftButton={() => (
              <SearchSvg
                width={20}
                height={20}
                style={{
                  alignSelf: 'center',
                }}
                fill={colors.mediumGray}
              />
            )}
            ref={inputRef}
            styles={autoCompleteStyles}
            enablePoweredByContainer={false}
            fetchDetails
            placeholder="Názov zastávky"
            onPress={onGooglePlaceChosen}
            query={{
              key: Constants.manifest?.extra?.googlePlacesApiKey,
              language: 'sk',
              location: '48.160170, 17.130256',
              radius: '20788', //20,788 km
              strictbounds: true,
              type: 'transit_station',
            }}
            renderRow={renderRow}
            textInputProps={{
              selectTextOnFocus: true,
              onBlur: () => {
                setGoogleAutocompleteSelection({ start: 0 })
                setTimeout(() => {
                  setGoogleAutocompleteSelection(undefined)
                }, 10)
              },
              selection: googleAutocompleteSelection,
            }}
          />
        </View>
        {chosenPlace && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 10 }}
          >
            {renderPlatforms()}
          </ScrollView>
        )}
      </View>
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
  map: { height: 200 },
  searchContainer: {
    backgroundColor: colors.white,
    flexGrow: 1,
    minHeight: 50,
    padding: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
  },
  searchResultRow: {
    flexDirection: 'row',
  },
  searchResultRowIcon: {
    marginRight: 5,
  },
})

export default SearchMhd
