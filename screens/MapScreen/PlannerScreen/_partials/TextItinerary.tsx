import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { DateTimeFormatter, Instant, LocalTime } from '@js-joda/core'
import { Ionicons } from '@expo/vector-icons'
import i18n from 'i18n-js'
import _ from 'lodash'

// import WheelchairSvg from '@icons/wheelchair.svg'
import WalkingSvg from '@icons/walking.svg'
import EllipseSvg from '@icons/ellipse.svg'
import CyclingSvg from '@icons/cycling.svg'
import ScooterSvg from '@icons/scooter.svg'
import TramSvg from '@icons/tram.svg'
import BusSvg from '@icons/bus.svg'

import RekolaHeaderSvg from '@icons/bottom-route-headers/rekola.svg'
import SlovnaftbajkHeaderSvg from '@icons/bottom-route-headers/slovnaftbajk.svg'
import TierHeaderSvg from '@icons/bottom-route-headers/tier.svg'

import OwnBicycle from '@icons/bottom-route-headers/own-bicycle.svg'
import OwnScooter from '@icons/bottom-route-headers/own-scooter.svg'
import Walking from '@icons/bottom-route-headers/walking.svg'

import {
  LegProps,
  s,
  colors,
  STYLES,
  getColor,
  getIcon,
  getProviderName,
  getTextColor,
  openProviderApp,
  getHeaderBgColor,
} from '@utils'
import { LegModes, MicromobilityProvider, TravelModes } from '@types'
import { useMhdStopsData } from '@hooks'
import { DashedLine, Button, BOTTOM_VEHICLE_BAR_HEIGHT_ALL } from '@components'

interface TextItineraryProps {
  legs: LegProps[]
  provider?: MicromobilityProvider
  isScooter?: boolean
  travelMode: TravelModes
}

const ICON_WIDTH = 20
const DASHED_HEIGHT = 20
const PADDING_HORIZONTAL = 10

const BIKESHARE_PROPERTY = 'BIKESHARE'

export const TextItinerary = ({
  legs,
  provider,
  isScooter,
  travelMode,
}: TextItineraryProps) => {
  // getData from /mhd/trip/{legs.tripId.substring(2)}
  const {
    data: dataMhdStops,
    isLoading: isLoadingMhd,
    errors: errorsMhd,
  } = useMhdStopsData()

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

  const getDashedLine = () => {
    return <DashedLine spacing={4} dashLength={2} color={colors.darkText} />
  }

  const renderProviderIconWithText = (text?: string) => {
    return (
      <View style={[styles.card, s.horizontalMargin]}>
        <View style={styles.left}>
          <View style={styles.inline}>
            {ProviderIcon && <ProviderIcon width={ICON_WIDTH} height={20} />}
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
            <WalkingSvg width={ICON_WIDTH} height={20} fill={colors.darkText} />
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

  const renderTransitOnOther = (
    leg: LegProps,
    startTime: '' | LocalTime | undefined,
    endTime: 0 | LocalTime | undefined
  ) => {
    return (
      <View
        style={[
          styles.card,
          s.horizontalMargin,
          styles.whiteCard,
          styles.cardVerticalMargin,
        ]}
      >
        <View style={styles.left}>
          {leg.mode === LegModes.tram && (
            <TramSvg
              width={ICON_WIDTH}
              height={20}
              fill={`#${leg.routeColor}`}
            />
          )}
          {leg.mode === LegModes.bus && (
            <BusSvg
              width={ICON_WIDTH}
              height={20}
              fill={`#${leg.routeColor}`}
            />
          )}
        </View>
        <View style={styles.middle}>
          <View>
            <View
              style={[
                s.lineNumber,
                { backgroundColor: `#${leg.routeColor}` },
                styles.lineNumberMarginRight,
              ]}
            >
              <Text style={{ color: `#${leg.routeTextColor}` }}>
                {leg.routeShortName}
              </Text>
            </View>
            {/* <WheelchairSvg width={30} height={20} /> // TODO add when trip data is available*/}
          </View>
          <View style={styles.stopsContainer}>
            <View>
              <Text style={[styles.textBold, styles.textSizeBig]}>
                {leg.from.name}
                {trimStopId(leg.from.stopId)}
              </Text>
              <View style={styles.heading}>
                <Ionicons
                  size={15}
                  style={{
                    alignSelf: 'center',
                    marginBottom: -3,
                  }}
                  name="arrow-forward"
                />
                <Text>{leg.headsign}</Text>
              </View>
              <View style={styles.mhdTripAdditionalInfoWrapper}>
                <Text style={styles.greyText}>
                  {leg?.to?.stopIndex &&
                    leg?.from?.stopIndex &&
                    i18n.t('common.stops', {
                      count: leg.to.stopIndex - leg.from.stopIndex,
                    })}
                </Text>
                <Text style={styles.greyText}>
                  {`${
                    leg?.duration &&
                    ', ' +
                      i18n.t('common.minutes', {
                        count: Math.floor(leg?.duration / 60),
                      })
                  }`}
                </Text>
                {/* TODO add multiple bus stops between api request when api for trip is available => /mhd/trip/{legs[].tripId}*/}
              </View>
            </View>
            {/* TODO add platform when it's available https://inovaciebratislava.atlassian.net/browse/PLAN-256 */}
            <Text style={[styles.textBold, styles.textSizeBig]}>
              {leg.to.name}
              {trimStopId(leg.to.stopId)}
            </Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text>
            {startTime &&
              startTime.format(DateTimeFormatter.ofPattern('HH:mm'))}
          </Text>
          <Text>
            {endTime && endTime.format(DateTimeFormatter.ofPattern('HH:mm'))}
          </Text>
        </View>
      </View>
    )
  }

  const getMobilityIcon = (isScooter?: boolean) => {
    const Icon = isScooter ? ScooterSvg : CyclingSvg
    return <Icon width={ICON_WIDTH} height={20} fill={colors.darkText} />
  }

  const trimStopId = (stopId: string | undefined) => {
    return dataMhdStops?.stops?.map((mhdStop) => {
      // mhdStop.id: 32500002
      // leg.to.stopId: 1:000000032500002
      const trimedStopId = _.trimStart(_.trimStart(stopId, '1:'), '0')
      return trimedStopId === mhdStop.id && mhdStop.platform
        ? ` ${mhdStop.platform}`
        : ''
    })
  }

  const headerTitle = (minutes = 13): string => {
    if (title) return title
    if (travelMode === TravelModes.mhd)
      return i18n.t('screens.PlannerScreen.mhdHeader', { minutes })
    if (travelMode === TravelModes.bicycle)
      return i18n.t('screens.FromToScreen.myBike')
    if (travelMode === TravelModes.scooter)
      return i18n.t('screens.FromToScreen.myScooter')
    if (travelMode === TravelModes.walk)
      return i18n.t('screens.FromToScreen.walk')
    return ''
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
          {headerTitle()}
        </Text>
        {!title && travelMode === TravelModes.mhd && (
          <Text
            style={[
              styles.textSizeBig,
              { color: getHeaderTextColor(provider) },
            ]}
          >
            {title || ' Meno zastávky'}
          </Text>
        )}
      </View>
      <View style={[styles.containerContent, styles.paddingVertical]}>
        {legs.map((leg, index) => {
          const startTime =
            leg.startTime &&
            LocalTime.ofInstant(Instant.ofEpochMilli(parseInt(leg.startTime)))
          const endTime =
            leg.endTime &&
            LocalTime.ofInstant(Instant.ofEpochMilli(leg.endTime))
          return (
            <View key={index}>
              {index === 0 && (
                <View style={[styles.card, s.horizontalMargin]}>
                  <View style={styles.left}>
                    <View style={styles.row}>
                      <View style={styles.icon}>
                        <EllipseSvg
                          width={ICON_WIDTH}
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
                renderTransitOnOther(leg, startTime, endTime)}
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
            style={{
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
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingVertical: 3,
    borderRadius: STYLES.borderRadius,
    display: 'flex',
    flexDirection: 'row',
  },
  cardVerticalMargin: {
    marginVertical: 5,
  },
  whiteCard: {
    backgroundColor: 'white',
    paddingVertical: 20,
    elevation: 3,
  },
  lineNumberMarginRight: {
    marginRight: 10,
  },
  icon: {
    width: ICON_WIDTH,
  },

  dashedLine: {
    height: DASHED_HEIGHT,
    width: ICON_WIDTH,
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  left: {},
  middle: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  textBold: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textSizeBig: {
    fontSize: 16,
  },
  greyText: {
    color: colors.lightText,
  },
  heading: {
    display: 'flex',
    flexDirection: 'row',
  },
  mhdTripAdditionalInfoWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 5,
  },
  stopsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})
