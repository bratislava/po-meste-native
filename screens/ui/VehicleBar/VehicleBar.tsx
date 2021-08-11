import React from 'react'
import { StyleSheet, View } from 'react-native'
import TicketSvg from '../../../assets/images/ticket.svg'

const VehicleBar = () => {
  return (
    <View style={styles.vehicleBar}>
      <View style={styles.iconLeft}>
        {/* TODO change for vehicle icon */}
        <TicketSvg fill={'green'} />
      </View>
      <View>
        {/* TODO change for vehicle icon */}
        <TicketSvg fill={'green'} />
      </View>
      <View>
        {/* TODO change for vehicle icon */}
        <TicketSvg fill={'green'} />
      </View>
      <View style={styles.iconRight}>
        {/* TODO change for vehicle icon */}
        <TicketSvg fill={'green'} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  vehicleBar: {
    display: 'flex',
    flex: 1,
    position: 'absolute',
    bottom: '0%',
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
