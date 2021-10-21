import React from 'react'
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

import { TravelModes, VehicleData } from '../../../types'
import { colors } from '@utils/theme'

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
                index + 1 != vehicles.length ? styles.vehicleContainerLast : {},
              ]}
              onPress={() => onVehicleChange(vehicle.mode)}
            >
              <vehicle.icon
                fill={selectedVehicle === vehicle.mode ? 'white' : colors.gray}
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
                {vehicle.estimatedTime}
              </Text>
              <Text
                style={[
                  styles.vehiclePrice,
                  selectedVehicle === vehicle.mode
                    ? styles.vehiclePriceSelected
                    : {},
                ]}
              >
                {vehicle.price}
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
    borderWidth: 1,
    borderLeftColor: colors.gray,
    borderRadius: 3,
    borderColor: colors.gray,
    width: 85,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
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
