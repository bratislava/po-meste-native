import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import i18n from 'i18n-js'
import AppLink from 'react-native-app-link'
import { Ionicons } from '@expo/vector-icons'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'

import { ConnectorProps } from '@utils/validation'
import { colors } from '@utils/theme'
import { s } from '@utils/globalStyles'
import ChargerSvg from '@images/charger.svg'
import Button from '@components/Button'
import ConnectorMiniature from './_partials/ConnectorMiniature'
import { BOTTOM_VEHICLE_BAR_HEIGHT_ALL } from '../../../../components/VehicleBar'

interface StationChargerInfoProps {
  name?: string
  openingTimes?: string | null
  numberOfParkingSpaces?: number | null
  connectors?: ConnectorProps[]
}

const StationChargerInfo = ({
  name,
  openingTimes,
  numberOfParkingSpaces,
  connectors,
}: StationChargerInfoProps) => {
  return (
    <BottomSheetScrollView
      contentContainerStyle={[
        styles.backgroundColorGrey,
        styles.contentWrapper,
      ]}
    >
      <View style={styles.backgroundColorWhite}>
        <View style={[styles.header, s.horizontalMargin]}>
          <Text>{i18n.t('zseChargerTitle')}</Text>
          <Text style={[s.boldText, styles.fontBiggest]}>{name}</Text>
        </View>
      </View>
      <View style={styles.backgroundColorWhite}>
        <View
          style={[
            s.horizontalMargin,
            styles.additionalInfoWrapper,
            styles.backgroundColorWhite,
          ]}
        >
          <View style={styles.vehicleImage}>
            <ChargerSvg height={150} />
          </View>
          <View style={styles.additionalText}>
            <View>
              {name !== undefined && (
                <Text style={[styles.mainInfoMargin, s.boldText]}>
                  <Ionicons
                    size={15}
                    style={{
                      alignSelf: 'center',
                      color: colors.lighterGray,
                    }}
                    name="location-sharp"
                  />
                  {name}
                </Text>
              )}
              {openingTimes !== undefined && (
                <Text style={[styles.mainInfoMargin, s.boldText]}>
                  <Ionicons
                    size={15}
                    style={{
                      alignSelf: 'center',
                      color: colors.lighterGray,
                    }}
                    name="time"
                  />
                  {openingTimes}
                </Text>
              )}
              {(numberOfParkingSpaces !== undefined ||
                numberOfParkingSpaces !== null) && (
                <Text style={[styles.mainInfoMargin, s.boldText]}>
                  <Ionicons
                    size={15}
                    style={{
                      alignSelf: 'center',
                      color: colors.lighterGray,
                    }}
                    name="car"
                  />
                  {i18n.t('parkingSpaces', {
                    amount: numberOfParkingSpaces,
                  })}
                </Text>
              )}
            </View>
            <View>
              <Button
                style={styles.rentButton}
                onPress={() =>
                  AppLink.openInStore({
                    appName: 'zse-drive',
                    appStoreId: 1180905521,
                    appStoreLocale: 'sk',
                    playStoreId: 'sk.zse.drive',
                  })
                    .then()
                    .catch()
                }
                title={i18n.t('startZseCharger')}
              />
            </View>
          </View>
        </View>
      </View>
      <View>
        <View style={s.horizontalMargin}>
          <Text style={[s.boldText, styles.fontBigger, styles.connectorsTitle]}>
            {i18n.t('chargingPoints')}
          </Text>
          {connectors?.map((connector) => {
            const { id, status, type, pricing } = connector
            return (
              <ConnectorMiniature
                key={id}
                status={status}
                type={type}
                chargingPrice={
                  pricing.charging_price ? pricing.charging_price : undefined
                }
                freeParkingTime={
                  pricing.free_parking_time
                    ? pricing.free_parking_time
                    : undefined
                }
                parkingPrice={pricing.parking_price}
              />
            )
          })}
        </View>
      </View>
    </BottomSheetScrollView>
  )
}

const styles = StyleSheet.create({
  header: {
    marginVertical: 10,
  },
  fontBiggest: {
    fontSize: 22,
  },
  fontBigger: {
    fontSize: 18,
  },
  connectorsTitle: {
    marginVertical: 15,
  },
  additionalInfoWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
  },
  vehicleImage: {
    width: 150,
  },
  additionalText: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
  },
  rentButton: {
    backgroundColor: colors.zseColor,
  },
  backgroundColorGrey: {
    backgroundColor: colors.lightLightGray,
  },
  contentWrapper: {
    paddingBottom: BOTTOM_VEHICLE_BAR_HEIGHT_ALL,
  },
  backgroundColorWhite: {
    backgroundColor: 'white',
  },
  mainInfoMargin: {
    marginBottom: 10,
  },
})

export default StationChargerInfo
