import Button from '@components/Button'
import { BOTTOM_TAB_NAVIGATOR_HEIGHT } from '@components/index'
import Text from '@components/Text'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import WheelchairSvg from '@icons/wheelchair.svg'
import { Slider } from '@miblanchard/react-native-slider'
import { GlobalStateContext } from '@state/GlobalStateProvider'
import { MicromobilityProvider } from '@types'
import { s } from '@utils/globalStyles'
import { colors } from '@utils/theme'
import i18n from 'i18n-js'
import _ from 'lodash'
import React, { useCallback, useContext, useState } from 'react'
import {
  Platform,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native'

export interface FilterData {
  maxTransfers: number | null
  accessibleOnly: boolean
  preferredProviders: MicromobilityProvider[]
  bikeRouteOptions: BikeRouteOptions
  walkingPace: number
}

export interface BikeRouteOptions {
  fastest?: boolean
  leastSlope?: boolean
  bikeFriendly?: boolean
}

interface FilterProps {
  onSubmit: (filterData: FilterData) => void
}

const Filter = ({ onSubmit }: FilterProps) => {
  const context = useContext(GlobalStateContext)
  const [filterData] = context.filterData
  const [accessibleOnly, setAccessibleOnly] = useState(
    filterData.accessibleOnly ?? false
  )
  const [maxTransfers, setMaxTransfers] = useState<number | null>(
    filterData.maxTransfers ?? null
  )

  const walkingPaceOptions = [3.5, 4.5, 5.5, 6.5]
  const [walkingPace, setwalkingPace] = useState(
    filterData.walkingPace ?? walkingPaceOptions[1]
  )

  const allProviders = [
    MicromobilityProvider.slovnaftbajk,
    MicromobilityProvider.rekola,
    MicromobilityProvider.tier,
    MicromobilityProvider.bolt,
  ]
  const [preferredProviders, setPreferredProviders] = useState<
    MicromobilityProvider[]
  >(filterData.preferredProviders ?? allProviders)

  const [bikeRouteOptions, setBikeRouteOptions] = useState<BikeRouteOptions>(
    filterData.bikeRouteOptions ?? {
      fastest: false,
      leastSlope: false,
      bikeFriendly: false,
    }
  )

  const handleBikeOptionsPress = useCallback(
    (option: BikeRouteOptions) =>
      setBikeRouteOptions((old) => ({ ...old, ...option })),
    [setBikeRouteOptions]
  )

  const handleMaxTransfersPress = useCallback(
    (count: number) => {
      if (maxTransfers === count) setMaxTransfers(null)
      else setMaxTransfers(count)
    },
    [maxTransfers, setMaxTransfers]
  )

  const handlePreferredProviderPress = useCallback(
    (provider: MicromobilityProvider) => {
      setPreferredProviders((old) =>
        old.includes(provider)
          ? old.filter((p) => p !== provider)
          : old.concat(provider)
      )
    },
    [setPreferredProviders]
  )

  const renderSwitch = (
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <Switch
      trackColor={{
        false: colors.disabledGray,
        true: colors.switchGreen,
      }}
      thumbColor={colors.white}
      ios_backgroundColor={colors.disabledGray}
      onValueChange={onValueChange}
      value={value}
      style={{
        flex: 0,
        marginLeft: Platform.select({
          ios: 10,
          android: 0,
        }),
      }}
    />
  )

  const micromobilityProviders = [
    { provider: MicromobilityProvider.slovnaftbajk },
    { provider: MicromobilityProvider.rekola },
    { provider: MicromobilityProvider.tier },
    { provider: MicromobilityProvider.bolt },
  ]

  return (
    <BottomSheetScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={{ ...s.textLarge, fontWeight: '500' }}>Filter</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>
          {i18n.t('screens.FromToScreen.Planner.Filter.transit')}
        </Text>
        <View
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
              marginBottom: 20,
            },
          ]}
        >
          <Text
            style={{
              flex: 0,
              marginRight: 15,
            }}
          >
            {i18n.t('screens.FromToScreen.Planner.Filter.maxTransfers')}
          </Text>
          {_.range(0, 4).map((index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleMaxTransfersPress(index)}
              style={[
                styles.tranfersButton,
                maxTransfers === index && styles.tranfersButtonSelected,
                index !== 3 && { marginRight: 15 },
                { justifyContent: 'center', alignItems: 'center' },
              ]}
            >
              <Text
                style={[
                  s.textMedium,
                  {
                    color:
                      maxTransfers === index
                        ? colors.white
                        : colors.disabledGray,
                  },
                ]}
              >
                {index}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}
        >
          <View style={[styles.row, { alignItems: 'center' }]}>
            <WheelchairSvg
              fill={colors.primary}
              width={20}
              height={20}
              style={{ marginRight: 7 }}
            />
            <Text style={styles.text}>
              {i18n.t('screens.FromToScreen.Planner.accessibleVehicles')}
            </Text>
          </View>
          {renderSwitch(accessibleOnly, (value) => setAccessibleOnly(value))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>
          {i18n.t('screens.FromToScreen.Planner.Filter.multimodalMode')}
        </Text>
        <Text style={styles.marginBottom}>
          {i18n.t(
            'screens.FromToScreen.Planner.Filter.multimodalPrefferedProviders'
          )}
        </Text>
        <View
          style={[
            styles.marginBottom,
            { flexDirection: 'row', justifyContent: 'space-evenly' },
          ]}
        >
          {micromobilityProviders.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.providerButton,
                preferredProviders.includes(value.provider) &&
                  styles.selectedProviderButton,
                index !== 3 && { marginRight: 10 },
              ]}
              onPress={() => handlePreferredProviderPress(value.provider)}
            >
              <Text>{value.provider}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>
          {i18n.t('screens.FromToScreen.Planner.Filter.bikesAndScooters')}
        </Text>
        <View>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text>
              {i18n.t('screens.FromToScreen.Planner.Filter.fastestRoute')}
            </Text>
            {renderSwitch(!!bikeRouteOptions.fastest, (value) =>
              handleBikeOptionsPress({ fastest: value })
            )}
          </View>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text>
              {i18n.t('screens.FromToScreen.Planner.Filter.leastSlopeRoute')}
            </Text>
            {renderSwitch(!!bikeRouteOptions.leastSlope, (value) =>
              handleBikeOptionsPress({ leastSlope: value })
            )}
          </View>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text>
              {i18n.t('screens.FromToScreen.Planner.Filter.bikeFriendlyRoute')}
            </Text>
            {renderSwitch(!!bikeRouteOptions.bikeFriendly, (value) =>
              handleBikeOptionsPress({ bikeFriendly: value })
            )}
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>
          {i18n.t('screens.FromToScreen.Planner.Filter.others')}
        </Text>
        <View>
          <View
            style={[
              styles.row,
              { justifyContent: 'space-between', marginBottom: 5 },
            ]}
          >
            <Text>
              {i18n.t('screens.FromToScreen.Planner.Filter.walkingPace')}
            </Text>
            <Text style={{ color: colors.primary }}>{`${walkingPace
              .toString()
              .replace('.', ',')}km/h`}</Text>
          </View>
          <Slider
            minimumValue={3.5}
            maximumValue={6.5}
            step={1}
            value={walkingPace}
            onValueChange={(value) => {
              setwalkingPace(Array.isArray(value) ? value[0] : value)
            }}
            trackMarks={walkingPaceOptions}
            trackStyle={{ height: 2 }}
            renderTrackMarkComponent={(index) => (
              <View
                style={[
                  index === 0 || index === walkingPaceOptions.length - 1
                    ? styles.largeTrackMark
                    : styles.trackMark,
                  index === walkingPaceOptions.length - 1 && { width: 6 },
                ]}
              />
            )}
            minimumTrackTintColor={colors.mediumGray}
            maximumTrackTintColor={colors.mediumGray}
            containerStyle={{ height: 25, marginBottom: 5 }}
            renderThumbComponent={() => <View style={styles.sliderThumb} />}
          />
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text style={[s.textTiny, { color: colors.darkGray }]}>
              {i18n.t('screens.FromToScreen.Planner.Filter.slow')}
            </Text>
            <Text style={[s.textTiny, { color: colors.darkGray }]}>
              {i18n.t('screens.FromToScreen.Planner.Filter.fast')}
            </Text>
          </View>
        </View>
      </View>
      <Button
        variant="primary"
        title={i18n.t('screens.FromToScreen.Planner.Filter.submitFilter')}
        titleStyle={{ textTransform: 'uppercase' }}
        onPress={() =>
          onSubmit({
            maxTransfers,
            accessibleOnly,
            preferredProviders,
            bikeRouteOptions,
            walkingPace,
          })
        }
      />
    </BottomSheetScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: BOTTOM_TAB_NAVIGATOR_HEIGHT + 20,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '500',
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
    ...s.textMedium,
  },
  section: {
    marginBottom: 30,
  },
  providerButton: {
    height: 50,
    minWidth: 20,
    flex: 1,
    borderWidth: 2,
    borderColor: colors.disabledGray,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedProviderButton: {
    borderColor: colors.black,
  },
  marginBottom: {
    marginBottom: 10,
  },
  tranfersButton: {
    flex: 1,
    height: 40,
    borderWidth: 2,
    borderColor: colors.disabledGray,
    borderRadius: 10,
  },
  tranfersButtonSelected: {
    flex: 1,
    height: 40,
    borderWidth: 0,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 2,
  },
  trackMark: {
    height: 12,
    width: 1,
    backgroundColor: colors.mediumGray,
    left: 12.5,
  },
  largeTrackMark: {
    height: 14,
    width: 4,
    backgroundColor: colors.mediumGray,
    left: 10.5,
    borderRadius: 5,
  },
  sliderThumb: {
    width: 25,
    height: 25,
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: 15,
    backgroundColor: colors.white,
  },
})

export default Filter
