import React, { useContext } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

import { GlobalStateContext } from '@state/GlobalStateProvider'
import { BOTTOM_TAB_NAVIGATOR_HEIGHT } from '@components/navigation/TabBar'
import { SvgProps } from 'react-native-svg'

const BOTTOM_VEHICLE_BAR_HEIGHT = 50
const BOTTOM_VEHICLE_BAR_MARGIN_BOTTOM = 10
const BOTTOM_TAB_NAVIGATOR_SPACING = 7.5

export const BOTTOM_VEHICLE_BAR_HEIGHT_ALL =
  BOTTOM_VEHICLE_BAR_HEIGHT +
  BOTTOM_VEHICLE_BAR_MARGIN_BOTTOM +
  BOTTOM_TAB_NAVIGATOR_SPACING

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

  const getVehicleIconStyled = (icon: () => React.FC<SvgProps>) => {
    const Icon = icon()
    return <Icon width={30} height={30} />
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
            {getVehicleIconStyled(() => icon(show))}
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
    flexDirection: 'row',
    position: 'absolute',
    bottom: BOTTOM_TAB_NAVIGATOR_HEIGHT + BOTTOM_TAB_NAVIGATOR_SPACING,
    marginBottom: BOTTOM_VEHICLE_BAR_MARGIN_BOTTOM,
    padding: 10,
    width: '90%',
    height: BOTTOM_VEHICLE_BAR_HEIGHT,
    minHeight: BOTTOM_VEHICLE_BAR_HEIGHT,
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
