import React, { useMemo } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import BottomSheet from 'reanimated-bottom-sheet'
import { Instant, LocalTime } from '@js-joda/core'
import { Ionicons } from '@expo/vector-icons'
import i18n from 'i18n-js'

import WheelchairSvg from '@images/wheelchair.svg'
import WalkingSvg from '@images/walking.svg'
import EllipseSvg from '@images/ellipse.svg'
import CyclingSvg from '@images/cycling.svg'
import TramSvg from '@images/tram.svg'
import BusSvg from '@images/bus.svg'
import { LegProps } from '@utils/validation'
import { renderHeader } from '@components/BottomSheetHeader'
import { LegModes } from '../../../types'
import { s } from '@utils/globalStyles'
import useMhdData from '@hooks/useMhdStopsData'
import DashedLine from '../DashedLine/DashedLine'
import { colors } from '@utils/theme'
import { STYLES } from '@utils/constants'

interface TextItineraryProps {
  legs: LegProps[]
}

const ICON_WIDTH = 20
const DASHED_HEIGHT = 20

export const TextItinerary = ({ legs }: TextItineraryProps) => {
  const bottomSheetSnapPoints = useMemo(() => ['100%', '60%', 0], [])
  // getData from /mhd/trip/{legs.tripId.substring(2)}
  const {
    data: dataMhdStops,
    isLoading: isLoadingMhd,
    errors: errorsMhd,
  } = useMhdData()

  const renderContent = () => (
    <View style={styles.container}>
      {legs.map((leg, index) => {
        const startTime =
          leg.startTime &&
          LocalTime.ofInstant(Instant.ofEpochMilli(parseInt(leg.startTime)))
        const endTime =
          leg.endTime && LocalTime.ofInstant(Instant.ofEpochMilli(leg.endTime))
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
                    <Text>Start</Text>
                  </View>
                </View>
              </View>
            )}
            {(leg.mode === LegModes.walk && (
              <View style={[styles.card, s.horizontalMargin]}>
                <View style={styles.left}>
                  <View style={styles.dashedLine}>
                    <DashedLine color={colors.darkText} />
                  </View>
                  <View style={styles.inline}>
                    <WalkingSvg
                      width={ICON_WIDTH}
                      height={40}
                      fill={colors.darkText}
                    />
                    <View>
                      {leg.duration !== undefined && (
                        <Text style={styles.textBold}>
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
                  <View style={styles.dashedLine}>
                    <DashedLine color={colors.darkText} />
                  </View>
                </View>
              </View>
            )) ||
              (leg.mode === LegModes.bicycle && (
                <View style={[styles.card, s.horizontalMargin]}>
                  <View style={styles.left}>
                    <View style={styles.inline}>
                      <CyclingSvg
                        width={ICON_WIDTH}
                        height={20}
                        fill={colors.darkText}
                      />
                      <View>
                        <Text>
                          {leg.duration &&
                            i18n.t('minShort', {
                              count: Math.floor(leg.duration / 60),
                            })}
                        </Text>
                      </View>
                    </View>
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
                          {dataMhdStops?.stops?.map((mhdStop) => {
                            return leg.from.stopId?.includes(
                              mhdStop.id.toString()
                            )
                              ? mhdStop.platform
                              : ''
                          })}
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
                      </Text>
                    </View>
                  </View>
                  <View style={styles.right}>
                    <Text>{startTime?.toString()}</Text>
                    <Text>{endTime?.toString()}</Text>
                  </View>
                </View>
              ))}
            {index === legs.length - 1 && (
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
                    <Text>End</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )
      })}
    </View>
  )

  return (
    <BottomSheet // TODO use import BottomSheet from '@gorhom/bottom-sheet' then erase 'reanimated-bottom-sheet' from app
      initialSnap={1}
      renderHeader={renderHeader}
      snapPoints={bottomSheetSnapPoints}
      renderContent={renderContent}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightLightGray,
    height: '100%',
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  inline: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    paddingHorizontal: 10,
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
