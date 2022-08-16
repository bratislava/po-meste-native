import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { TravelModes, VehicleData } from '@types'
import { colors, s } from '@utils'

type Props = {
  selectedVehicle: TravelModes
  vehicles: VehicleData[]
  onVehicleChange: (mode: TravelModes) => void
}

const VehicleSelector = ({
  selectedVehicle,
  onVehicleChange,
  vehicles,
}: Props) => {
  return (
    <ScrollView horizontal>
      <View style={styles.container}>
        {vehicles.map((vehicle, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.vehicleContainer,
                selectedVehicle === vehicle.mode
                  ? styles.vehicleContainerSelected
                  : {},
                index !== vehicles.length - 1
                  ? styles.vehicleContainerLast
                  : {},
              ]}
              onPress={() => onVehicleChange(vehicle.mode)}
            >
              <vehicle.icon
                fill={
                  selectedVehicle === vehicle.mode ? 'white' : colors.mediumGray
                }
                width={24}
                height={20}
                style={styles.vehicleIcon}
              />
              <Text
                style={[
                  styles.vehicleEstimatedTime,
                  selectedVehicle === vehicle.mode
                    ? styles.vehicleEstimatedTimeSelected
                    : {},
                ]}
              >
                {vehicle.estimatedTimeMin}
                {vehicle.estimatedTimeMin !== undefined &&
                  vehicle.estimatedTimeMax !== undefined &&
                  ` - `}
                {vehicle.estimatedTimeMax}
                {vehicle.estimatedTimeMin !== undefined ||
                vehicle.estimatedTimeMax !== undefined
                  ? ` min`
                  : `--`}
              </Text>
              <Text
                style={[
                  styles.vehiclePrice,
                  selectedVehicle === vehicle.mode
                    ? styles.vehiclePriceSelected
                    : {},
                ]}
              >
                {vehicle.priceMin}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  vehicleContainer: {
    padding: 7,
    borderWidth: 2,
    borderColor: colors.mediumGray,
    width: 85,
    height: 70,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    ...s.roundedBorder,
  },
  vehicleContainerLast: {
    marginRight: 10,
  },
  vehicleContainerSelected: {
    borderWidth: 0,
    backgroundColor: colors.primary,
  },
  vehicleIcon: {
    marginBottom: 5,
  },
  vehicleEstimatedTime: {
    fontWeight: 'bold',
    color: colors.gray,
    ...s.textTiny,
  },
  vehicleEstimatedTimeSelected: {
    color: 'white',
  },
  vehiclePrice: {
    color: colors.gray,
  },
  vehiclePriceSelected: {
    color: 'white',
  },
})

export default VehicleSelector
