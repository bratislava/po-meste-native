import React, { useContext, useState } from 'react'
import { View, StyleSheet } from 'react-native'

import { GlobalStateContext, VehicleProps } from '@state/GlobalStateProvider'
import { BOTTOM_TAB_NAVIGATOR_HEIGHT } from '@components/navigation/TabBar'
import { SvgProps } from 'react-native-svg'
import { TouchableHighlight } from 'react-native-gesture-handler'

const BOTTOM_VEHICLE_BAR_HEIGHT = 50
const BOTTOM_VEHICLE_BAR_MARGIN_BOTTOM = 10
const BOTTOM_TAB_NAVIGATOR_SPACING = 7.5
const ICON_SIZE = 30

export const BOTTOM_VEHICLE_BAR_HEIGHT_ALL =
  BOTTOM_VEHICLE_BAR_HEIGHT +
  BOTTOM_VEHICLE_BAR_MARGIN_BOTTOM +
  BOTTOM_TAB_NAVIGATOR_SPACING

const VehicleBar = () => {
  const vehiclesContext = useContext(GlobalStateContext)

  return (
    <View style={styles.vehicleBar}>
      {vehiclesContext.vehicleTypes?.map((vehicleType, index) => {
        return (
          <VehicleFilterTouchable
            key={index}
            vehicleType={vehicleType}
            index={index}
          />
        )
      })}
    </View>
  )
}

interface VehicleFilterTouchableProps {
  vehicleType: VehicleProps
  index: number
}

const VehicleFilterTouchable = ({
  vehicleType,
  index,
}: VehicleFilterTouchableProps) => {
  const { id, icon, show } = vehicleType
  const vehiclesContext = useContext(GlobalStateContext)
  const [isPressed, setPressed] = useState(false)

  const onVehicleClick = (id: string) => {
    vehiclesContext.setVehicleTypes((oldVehicleTypes) => {
      let clickedOnShown = false
      let oneNotShown = false
      const clickedOnSingleShown = oldVehicleTypes.some((vehicleType) => {
        if (vehicleType.id === id && vehicleType.show === true) {
          clickedOnShown = true
        } else if (vehicleType.id !== id && vehicleType.show === false) {
          oneNotShown = true
        }
        return clickedOnShown && oneNotShown
      })
      const newVehicleTypes = oldVehicleTypes.map((vehicleType) => {
        if (clickedOnSingleShown) {
          return {
            ...vehicleType,
            show: true,
          }
        }
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
    return <Icon width={ICON_SIZE} height={ICON_SIZE} />
  }

  return (
    <TouchableHighlight
      key={id}
      underlayColor="#000000"
      style={[
        styles.icon,
        index === 0 ? styles.iconLeft : {},
        index === vehiclesContext.vehicleTypes.length - 1
          ? styles.iconRight
          : {},
      ]}
      onPress={() => onVehicleClick(id)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      {getVehicleIconStyled(() => icon(isPressed ? true : show))}
    </TouchableHighlight>
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
    borderRadius: ICON_SIZE / 2,
  },
  icon: {
    borderRadius: ICON_SIZE / 2,
  },
  iconLeft: {
    marginLeft: 20,
  },
  iconRight: {
    marginRight: 20,
  },
})

export default VehicleBar
