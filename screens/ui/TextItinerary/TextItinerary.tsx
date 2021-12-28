import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { DateTimeFormatter, Instant, LocalTime } from '@js-joda/core'
import { Ionicons } from '@expo/vector-icons'
import i18n from 'i18n-js'
import _ from 'lodash'

import WheelchairSvg from '@images/wheelchair.svg'
import WalkingSvg from '@images/walking.svg'
import EllipseSvg from '@images/ellipse.svg'
import CyclingSvg from '@images/cycling.svg'
import ScooterSvg from '@images/scooter.svg'
import TramSvg from '@images/tram.svg'
import BusSvg from '@images/bus.svg'
import { LegProps } from '@utils/validation'
import { LegModes, MicromobilityProvider } from '../../../types'
import { s } from '@utils/globalStyles'
import useMhdData from '@hooks/useMhdStopsData'
import DashedLine from '../DashedLine/DashedLine'
import { colors } from '@utils/theme'
import { STYLES } from '@utils/constants'
import {
  getColor,
  getIcon,
  getProviderName,
  getTextColor,
  openProviderApp,
} from '@utils/utils'
import Button from '@components/Button'
import { BOTTOM_VEHICLE_BAR_HEIGHT_ALL } from '@screens/ui/VehicleBar/VehicleBar'

interface TextItineraryProps {
  legs: LegProps[]
  provider?: MicromobilityProvider
  isScooter?: boolean
}

const ICON_WIDTH = 20
const DASHED_HEIGHT = 20
const PADDING_HORIZONTAL = 10

const BIKESHARE_PROPERTY = 'BIKESHARE'

export const TextItinerary = ({
  legs,
  provider,
  isScooter,
}: TextItineraryProps) => {
  // getData from /mhd/trip/{legs.tripId.substring(2)}
  const {
    data: dataMhdStops,
    isLoading: isLoadingMhd,
    errors: errorsMhd,
  } = useMhdData()

  const ProviderIcon = provider && getIcon(provider, isScooter)
  const title = provider && getProviderName(provider)

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

  return (
    <BottomSheetScrollView style={styles.container}>
      {(title || ProviderIcon) && (
        <View style={[styles.card, s.horizontalMargin]}>
          {ProviderIcon && <ProviderIcon width={30} height={30} />}
          {title && (
            <Text style={[styles.textMargin, styles.textBold]}>{title}</Text>
          )}
        </View>
      )}
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
                        {i18n.t('start')}
                      </Text>
                    </View>
                    <View style={styles.dashedLine}>{getDashedLine()}</View>
                  </View>
                </View>
              )}
              {getFirstRentedInstanceIndex === index &&
                renderProviderIconWithText(leg.from.name)}
              {(leg.mode === LegModes.walk && (
                <View style={[styles.card, s.horizontalMargin]}>
                  <View style={styles.left}>
                    <View style={styles.inline}>
                      <WalkingSvg
                        width={ICON_WIDTH}
                        height={20}
                        fill={colors.darkText}
                      />
                      <View style={styles.textMargin}>
                        {leg.duration !== undefined && (
                          <Text>
                            {i18n.t('minShort', {
                              count: Math.floor(leg.duration / 60),
                            })}
                          </Text>
                        )}
                        <Text>
                          {leg.distance !== undefined &&
                            i18n.t('distanceShort', {
                              count: Math.floor(leg.distance),
                            })}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.dashedLine}>{getDashedLine()}</View>
                  </View>
                </View>
              )) ||
                (leg.mode === LegModes.bicycle && (
                  <View style={[styles.card, s.horizontalMargin]}>
                    <View style={styles.left}>
                      <View style={styles.inline}>
                        {getMobilityIcon(isScooter)}
                        <View style={styles.textMargin}>
                          <Text>
                            {leg.duration &&
                              i18n.t('minShort', {
                                count: Math.floor(leg.duration / 60),
                              })}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.dashedLine}>{getDashedLine()}</View>
                    </View>
                  </View>
                )) ||
                (leg.mode !== LegModes.bicycle && leg.mode !== LegModes.walk && (
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
                                i18n.t('stops', {
                                  count: leg.to.stopIndex - leg.from.stopIndex,
                                })}
                            </Text>
                            <Text style={styles.greyText}>
                              {`${
                                leg?.duration &&
                                ', ' +
                                  i18n.t('minutes', {
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
                          startTime.format(
                            DateTimeFormatter.ofPattern('HH:mm')
                          )}
                      </Text>
                      <Text>
                        {endTime &&
                          endTime.format(DateTimeFormatter.ofPattern('HH:mm'))}
                      </Text>
                    </View>
                  </View>
                ))}
              {getLastRentedInstanceIndex === index &&
                renderProviderIconWithText(leg.to.name)}
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
                        {i18n.t('end')}
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
            title={i18n.t('openApp', {
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
    backgroundColor: colors.white,
    marginBottom: BOTTOM_VEHICLE_BAR_HEIGHT_ALL,
  },
  paddingVertical: {
    paddingVertical: 20,
  },
  containerContent: {
    backgroundColor: colors.lightLightGray,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  inline: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textMargin: {
    marginLeft: 10,
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
