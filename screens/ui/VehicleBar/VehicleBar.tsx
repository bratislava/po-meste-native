import React from 'react'
import { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import TicketSvg from '../../../assets/images/ticket.svg'

const VehicleBar = () => {
  const [vehicleTypes, setVehicleTypes] = useState([
    {
      id: 'car',
      show: true,
      icon: (color: string) => <TicketSvg fill={color} />, //TODO change for vehicle icon
    },
    {
      id: 'bike',
      show: true,
      icon: (color: string) => <TicketSvg fill={color} />, //TODO change for vehicle icon
    },
    {
      id: 'mhd',
      show: true,
      icon: (color: string) => <TicketSvg fill={color} />, //TODO change for vehicle icon
    },
    {
      id: 'chargers',
      show: true,
      icon: (color: string) => <TicketSvg fill={color} />, //TODO change for vehicle icon
    },
  ])

  const onVehicleClick = (id: string) => {
    setVehicleTypes((oldVehicleTypes) => {
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
      {vehicleTypes.map((vehicleType, index) => {
        const { id, icon, show } = vehicleType
        return (
          <TouchableOpacity
            key={id}
            style={[
              index === 0 ? styles.iconLeft : {},
              index === vehicleTypes.length - 1 ? styles.iconRight : {},
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
    bottom: 0,
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
