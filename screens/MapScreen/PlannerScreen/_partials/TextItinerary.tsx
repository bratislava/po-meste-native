import { Ionicons } from '@expo/vector-icons'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Instant, LocalTime } from '@js-joda/core'
import i18n from 'i18n-js'
import _ from 'lodash'
import { StyleSheet, Text, View } from 'react-native'

// import WheelchairSvg from '@icons/wheelchair.svg'
import EllipseSvg from '@icons/ellipse.svg'
import CyclingSvg from '@icons/vehicles/cycling.svg'
import ScooterSvg from '@icons/vehicles/scooter.svg'
import WalkingSvg from '@icons/walking.svg'

import { Button, DashedLine } from '@components'
import { LegModes, MicromobilityProvider } from '@types'
import React, { useEffect, useState } from 'react'

// import WheelchairSvg from '@icons/wheelchair.svg'

import RekolaHeaderSvg from '@icons/bottom-route-headers/rekola.svg'
import SlovnaftbajkHeaderSvg from '@icons/bottom-route-headers/slovnaftbajk.svg'
import TierHeaderSvg from '@icons/bottom-route-headers/tier.svg'

import OwnBicycle from '@icons/bottom-route-headers/own-bicycle.svg'
import OwnScooter from '@icons/bottom-route-headers/own-scooter.svg'
import Walking from '@icons/bottom-route-headers/walking.svg'

import { TravelModes } from '@types'
import {
  colors,
  getColor,
  getHeaderBgColor,
  getIcon,
  getProviderName,
  getTextColor,
  LegProps,
  openProviderApp,
  s,
} from '@utils'
import MhdTransitCard from './_partials/MhdTransitCard'

interface TextItineraryProps {
  legs: LegProps[]
  provider?: MicromobilityProvider
  isScooter?: boolean
  travelMode: TravelModes
}

export const ITINERARY_ICON_WIDTH = 20
const DASHED_HEIGHT = 20
export const ITINERARY_PADDING_HORIZONTAL = 10

const BIKESHARE_PROPERTY = 'BIKESHARE'

export const TextItinerary = ({
  legs,
  provider,
  isScooter,
  travelMode,
}: TextItineraryProps) => {
  const [timeNow, setTimeNow] = useState(LocalTime.now())
  const [updateEveryMinuteInterval, setUpdateEveryMinuteInterval] = useState<
    number | undefined
  >(undefined)

  useEffect(() => {
    if (travelMode === TravelModes.mhd)
      setUpdateEveryMinuteInterval(
        window.setInterval(() => setTimeNow(LocalTime.now()), 60 * 1000)
      )
    return () => {
      if (travelMode === TravelModes.mhd)
        clearInterval(updateEveryMinuteInterval)
    }
  }, [])

  const ProviderIcon = provider && getIcon(provider, isScooter)
  const title = provider && getProviderName(provider)
  const getHeaderIcon = (
    provider: MicromobilityProvider | undefined,
    travelMode: TravelModes
  ) => {
    switch (provider) {
      case MicromobilityProvider.rekola:
        return RekolaHeaderSvg
      case MicromobilityProvider.slovnaftbajk:
        return SlovnaftbajkHeaderSvg
      case MicromobilityProvider.tier:
        return TierHeaderSvg
      default:
        break
    }
    switch (travelMode) {
      case TravelModes.bicycle:
        return OwnBicycle
      case TravelModes.scooter:
        return OwnScooter
      case TravelModes.walk:
        return Walking
      default:
        break
    }
  }
  const HeaderIcon = getHeaderIcon(provider, travelMode)
  const getHeaderTextColor = (provider: MicromobilityProvider | undefined) => {
    switch (provider) {
      case MicromobilityProvider.rekola:
        return '#FFFFFF'
      case MicromobilityProvider.slovnaftbajk:
        return '#454545'
      case MicromobilityProvider.tier:
        return '#454545'
      default:
        return '#FFFFFF'
    }
  }

  const getFirstRentedInstanceIndex = legs.findIndex(
    (leg) => leg.from.vertexType === BIKESHARE_PROPERTY
  )

  const getLastRentedInstanceIndex = _.findLastIndex(
    legs,
    (leg) => leg.from.vertexType === BIKESHARE_PROPERTY
  )

  const firstStop = legs.find((leg) => leg.from.vertexType === 'TRANSIT')

  const getDashedLine = () => {
    return <DashedLine spacing={4} dashLength={2} color={colors.darkText} />
  }

  const renderProviderIconWithText = (text?: string) => {
    return (
      <View style={[styles.card, s.horizontalMargin]}>
        <View style={styles.left}>
          <View style={styles.inline}>
            {ProviderIcon && (
              <ProviderIcon width={ITINERARY_ICON_WIDTH} height={20} />
            )}
            <Text style={[styles.textBold, styles.textMargin]}>{text}</Text>
          </View>
          <View style={styles.dashedLine}>{getDashedLine()}</View>
        </View>
      </View>
    )
  }

  const renderTransitOnFoot = (leg: LegProps) => {
    return (
      <View style={[styles.card, s.horizontalMargin]}>
        <View style={styles.left}>
          <View style={styles.inline}>
            <WalkingSvg
              width={ITINERARY_ICON_WIDTH}
              height={20}
              fill={colors.darkText}
            />
            <View style={styles.textMargin}>
              {leg.duration !== undefined && (
                <Text>
                  {i18n.t('screens.PlannerScreen.minShort', {
                    count: Math.floor(leg.duration / 60),
                  })}
                </Text>
              )}
              <Text>
                {leg.distance !== undefined &&
                  i18n.t('screens.PlannerScreen.distanceShort', {
                    count: Math.floor(leg.distance),
                  })}
              </Text>
            </View>
          </View>
          <View style={styles.dashedLine}>{getDashedLine()}</View>
        </View>
      </View>
    )
  }

  const renderTransitOnMicromobility = (leg: LegProps) => {
    return (
      <View style={[styles.card, s.horizontalMargin]}>
        <View style={styles.left}>
          <View style={styles.inline}>
            {getMobilityIcon(isScooter)}
            <View style={styles.textMargin}>
              <Text>
                {leg.duration &&
                  i18n.t('screens.PlannerScreen.minShort', {
                    count: Math.floor(leg.duration / 60),
                  })}
              </Text>
            </View>
          </View>
          <View style={styles.dashedLine}>{getDashedLine()}</View>
        </View>
      </View>
    )
  }

  const renderTransitOnOther = (leg: LegProps) => {
    return <MhdTransitCard leg={leg} />
  }

  const getMobilityIcon = (isScooter?: boolean) => {
    const Icon = isScooter ? ScooterSvg : CyclingSvg
    return (
      <Icon width={ITINERARY_ICON_WIDTH} height={20} fill={colors.darkText} />
    )
  }

  const headerTitle = (minutes = '13'): string => {
    if (title) return title
    switch (travelMode) {
      case TravelModes.mhd:
        return i18n.t('screens.PlannerScreen.mhdHeader', { minutes })
      case TravelModes.bicycle:
        return i18n.t('screens.FromToScreen.Planner.myBike')
      case TravelModes.scooter:
        return i18n.t('screens.FromToScreen.Planner.myScooter')
      case TravelModes.walk:
        return i18n.t('screens.FromToScreen.Planner.walk')
      default:
        return ''
    }
  }

  return (
    <BottomSheetScrollView style={styles.container}>
      <View
        style={[
          styles.card,
          s.horizontalPadding,
          styles.cardHeader,
          { backgroundColor: getHeaderBgColor(travelMode, provider) },
        ]}
      >
        {HeaderIcon && <HeaderIcon width={30} height={30} />}
        <Text
          style={[
            styles.textMargin,
            styles.textBold,
            { color: getHeaderTextColor(provider) },
          ]}
        >
          {headerTitle(
            firstStop?.startTime && //TODO Live data from getMhdStopStatusData(firstStop.id)
              Math.floor(
                (LocalTime.ofInstant(
                  Instant.ofEpochMilli(parseInt(firstStop.startTime))
                ).toSecondOfDay() -
                  LocalTime.now().toSecondOfDay()) /
                  60
              ).toString()
          )}
        </Text>
        {!title && travelMode === TravelModes.mhd && (
          <Text
            style={[
              styles.textSizeBig,
              { color: getHeaderTextColor(provider) },
            ]}
          >
            {title ||
              ` ${firstStop?.from.name}${
                firstStop?.from.platformCode
                  ? ' ' + firstStop?.from.platformCode
                  : ''
              }`}
          </Text>
        )}
      </View>
      <View style={[styles.containerContent, styles.paddingVertical]}>
        {legs.map((leg, index) => {
          return (
            <View key={index}>
              {index === 0 && (
                <View style={[styles.card, s.horizontalMargin]}>
                  <View style={styles.left}>
                    <View style={styles.row}>
                      <View style={styles.icon}>
                        <EllipseSvg
                          width={ITINERARY_ICON_WIDTH}
                          height={20}
                          fill={colors.darkText}
                        />
                      </View>
                      {/* TODO add location based on google or get it from previous screen */}
                      <Text style={[styles.textMargin, styles.textBold]}>
                        {i18n.t('screens.PlannerScreen.start')}
                      </Text>
                    </View>
                    <View style={styles.dashedLine}>{getDashedLine()}</View>
                  </View>
                </View>
              )}
              {getFirstRentedInstanceIndex === index &&
                renderProviderIconWithText(leg.from.name)}
              {getLastRentedInstanceIndex === index &&
                renderProviderIconWithText(leg.from.name)}
              {leg.mode === LegModes.walk && renderTransitOnFoot(leg)}
              {leg.mode === LegModes.bicycle &&
                renderTransitOnMicromobility(leg)}
              {leg.mode !== LegModes.bicycle &&
                leg.mode !== LegModes.walk &&
                renderTransitOnOther(leg)}
              {index === legs.length - 1 && (
                <View style={[styles.card, s.horizontalMargin]}>
                  <View style={styles.left}>
                    <View style={styles.row}>
                      <View style={styles.icon}>
                        <Ionicons
                          size={24}
                          style={{
                            alignSelf: 'center',
                            color: colors.darkText,
                          }}
                          name="location-sharp"
                        />
                      </View>
                      {/* TODO add location based on google or get it from previous screen */}
                      <Text style={[styles.textMargin, styles.textBold]}>
                        {i18n.t('screens.PlannerScreen.end')}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )
        })}
        {/* TODO do it like in https://github.com/bratislava/hybaj-native/pull/49 StationMicromobilityInfo.tsx */}
        {provider && (
          <Button
            contentStyle={{
              backgroundColor: getColor(provider),
            }}
            titleStyle={{ color: getTextColor(provider) }}
            onPress={() => openProviderApp(provider)}
            title={i18n.t('screens.PlannerScreen.openApp', {
              provider: title,
            })}
          />
        )}
      </View>
    </BottomSheetScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightLightGray,
  },
  paddingVertical: {
    paddingVertical: 20,
  },
  containerContent: {
    backgroundColor: colors.lightLightGray,
  },
  inline: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textMargin: {
    marginLeft: 10,
  },
  cardHeader: {
    borderRadius: 0,
    justifyContent: 'center',
    paddingBottom: 14,
  },
  card: {
    paddingHorizontal: ITINERARY_PADDING_HORIZONTAL,
    paddingVertical: 3,
    borderRadius: 7,
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    width: ITINERARY_ICON_WIDTH,
  },

  dashedLine: {
    height: DASHED_HEIGHT,
    width: ITINERARY_ICON_WIDTH,
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  left: {},
  textBold: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textSizeBig: {
    fontSize: 16,
  },
})
