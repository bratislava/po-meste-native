import Accordion from '@components/Accordion'
import Line from '@components/Line'
import { Ionicons } from '@expo/vector-icons'
import ChevronRightSmall from '@icons/chevron-right-small.svg'
import BusSvg from '@icons/vehicles/bus.svg'
import TramSvg from '@icons/vehicles/tram.svg'
import TrolleybusSvg from '@icons/vehicles/trolleybus.svg'
import { DateTimeFormatter, Instant, LocalTime } from '@js-joda/core'
import { LegModes } from '@types'
import { getMhdTrip } from '@utils/api'
import { trolleybusLineNumbers } from '@utils/constants'
import { s } from '@utils/globalStyles'
import { colors } from '@utils/theme'
import { LegProps } from '@utils/validation'
import i18n from 'i18n-js'
import _ from 'lodash'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useQuery } from 'react-query'
import {
  ITINERARY_ICON_WIDTH,
  ITINERARY_PADDING_HORIZONTAL,
} from '../TextItinerary'

interface MhdTransitCardProps {
  leg: LegProps
}

const MhdTransitCard = ({ leg }: MhdTransitCardProps) => {
  const trip = useQuery(['getMhdTrip', leg.tripId], async () =>
    getMhdTrip(_.trimStart(leg.tripId, '1:'))
  )
  const startTime =
    leg.startTime &&
    LocalTime.ofInstant(Instant.ofEpochMilli(parseInt(leg.startTime)))
  const endTime =
    leg.endTime && LocalTime.ofInstant(Instant.ofEpochMilli(leg.endTime))

  const accordion = trip.data && (
    <Accordion
      overrideStyles={{
        container: {
          backgroundColor: colors.white,
          borderRadius: 8,
          width: '100%',
          paddingVertical: 15,
          marginBottom: 20,
          overflow: 'hidden',
          alignItems: 'stretch',
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 1,
        },
        arrowContainer: {},
        bodyContainer: {
          marginTop: 20,
          position: 'absolute',
        },
        bodyContainerText: {
          height: 'auto',
        },
      }}
      arrowIcon={(isOpen) => (
        <ChevronRightSmall
          width={12}
          height={12}
          fill={colors.primary}
          style={{ transform: [{ rotate: isOpen ? '270deg' : '90deg' }] }}
        />
      )}
      items={[
        {
          title: (
            <View style={styles.mhdTripAdditionalInfoWrapper}>
              <Text style={styles.greyText}>
                {(leg?.from?.stopIndex || leg?.from?.stopIndex === 0) &&
                  (leg?.to?.stopIndex || leg?.to?.stopIndex === 0) &&
                  i18n.t('common.stops', {
                    count: leg?.to?.stopIndex - leg?.from?.stopIndex,
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
            </View>
          ),
          body: (
            <View>
              {trip.data.timeline
                ?.slice(leg.from.stopIndex, leg.to.stopIndex ?? 0 + 1)
                .map((stop) => (
                  <Text key={stop.stopId}>{stop.stopName}</Text>
                ))}
            </View>
          ),
        },
      ]}
    />
  )

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
            width={ITINERARY_ICON_WIDTH}
            height={20}
            fill={`#${leg.routeColor}`}
          />
        )}
        {leg.mode === LegModes.bus &&
          (trolleybusLineNumbers.includes(leg.routeShortName ?? '') ? (
            <TrolleybusSvg
              width={ITINERARY_ICON_WIDTH}
              height={20}
              fill={`#${leg.routeColor}`}
            />
          ) : (
            <BusSvg
              width={ITINERARY_ICON_WIDTH}
              height={20}
              fill={`#${leg.routeColor}`}
            />
          ))}
        <View style={styles.line}>
          <Line color={`#${leg.routeColor}`} />
        </View>
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
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.textBold, styles.textSizeBig]}>
                {leg.from.name}
              </Text>
              <Text
                style={[
                  styles.textBold,
                  styles.textSizeBig,
                  { color: colors.darkGray },
                ]}
              >
                {` ${leg.from.platformCode}`}
              </Text>
            </View>
            <View style={styles.heading}>
              <Ionicons
                size={15}
                style={{
                  alignSelf: 'center',
                  marginBottom: -3,
                }}
                name="arrow-forward"
              />
              <Text style={s.textTiny}>{leg.headsign}</Text>
            </View>
            <View>{accordion}</View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.textBold, styles.textSizeBig]}>
              {leg.to.name}
            </Text>
            <Text
              style={[
                styles.textBold,
                styles.textSizeBig,
                { color: colors.darkGray },
              ]}
            >
              {` ${leg.to.platformCode}`}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.right}>
        <Text>
          {startTime && startTime.format(DateTimeFormatter.ofPattern('HH:mm'))}
        </Text>
        <Text>
          {endTime && endTime.format(DateTimeFormatter.ofPattern('HH:mm'))}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: ITINERARY_PADDING_HORIZONTAL,
    paddingVertical: 3,
    borderRadius: 7,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
  line: {
    alignItems: 'center',
    flex: 1,
  },
  left: {
    height: '100%',
    justifyContent: 'flex-start',
  },
  middle: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'green',
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
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: 'blue',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

export default MhdTransitCard
