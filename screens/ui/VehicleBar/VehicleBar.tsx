import React, { useContext } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

import { GlobalStateContext } from '@components/common/GlobalStateProvider'

const VehicleBar = () => {
  const vehiclesContext = useContext(GlobalStateContext)

  const onVehicleClick = (id: string) => {
    vehiclesContext.setVehicleTypes((oldVehicleTypes) => {
      const newVehicleTypes = oldVehicleTypes.map((vehicleType) => {
        return {
          ...vehicleType,
          show: id === vehicleType.id ? true : false,
        }
      })
      return newVehicleTypes
    })
  }

  return (
    <View style={styles.vehicleBar}>
      {vehiclesContext.vehicleTypes?.map((vehicleType, index) => {
        const { id, icon, show } = vehicleType
        return (
          <TouchableOpacity
            key={id}
            style={[
              index === 0 ? styles.iconLeft : {},
              index === vehiclesContext.vehicleTypes.length - 1
                ? styles.iconRight
                : {},
            ]}
            onPress={() => onVehicleClick(id)}
          >
            {icon(show ? 'red' : 'grey')}
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  vehicleBar: {
    display: 'flex',
    flex: 1,
    position: 'absolute',
    bottom: 62.5,
    marginBottom: 10,
    padding: 10,
    width: '90%',
    height: 50,
    minHeight: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 15,
  },
  iconLeft: {
    marginLeft: 20,
  },
  iconRight: {
    marginRight: 20,
  },
})

export default VehicleBar
