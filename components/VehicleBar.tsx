import React, { useContext, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { BOTTOM_TAB_NAVIGATOR_HEIGHT } from '@components/navigation/TabBar'
import { GlobalStateContext, VehicleProps } from '@state/GlobalStateProvider'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { SvgProps } from 'react-native-svg'

import {
  useMhdStopsData,
  useRekolaData,
  useSlovnaftbajkData,
  useTierData,
  useZseChargersData,
} from '@hooks'
import { VehicleType } from '@types'
import { colors } from '@utils/theme'
import * as Progress from 'react-native-progress'

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

  const { isLoading: isLoadingMhd } = useMhdStopsData()
  const { isLoading: isLoadingTier } = useTierData()
  const { isLoading: isLoadingZseChargers } = useZseChargersData()
  const { isLoading: isLoadingRekola } = useRekolaData()
  const { isLoading: isLoadingSlovnaftbajk } = useSlovnaftbajkData()
  return (
    <View style={styles.vehicleBar}>
      {vehiclesContext.vehicleTypes?.map((vehicleType, index) => {
        const { id } = vehicleType
        const isLoading =
          (id === VehicleType.mhd && isLoadingMhd) ||
          (id === VehicleType.bicycle &&
            (isLoadingRekola || isLoadingSlovnaftbajk)) ||
          (id === VehicleType.chargers && isLoadingZseChargers) ||
          (id === VehicleType.scooter && isLoadingTier)
        return (
          <VehicleFilterTouchable
            key={index}
            vehicleType={vehicleType}
            index={index}
            isLoading={isLoading}
          />
        )
      })}
    </View>
  )
}

interface VehicleFilterTouchableProps {
  vehicleType: VehicleProps
  index: number
  isLoading: boolean
}

const VehicleFilterTouchable = ({
  vehicleType,
  index,
  isLoading,
}: VehicleFilterTouchableProps) => {
  const { id, icon, show } = vehicleType
  const vehiclesContext = useContext(GlobalStateContext)
  const [isPressed, setIsPressed] = useState(false)

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

  const getVehicleIconStyled = (
    isLoading: boolean,
    icon: () => React.FC<SvgProps>
  ) => {
    const Icon = icon()
    return (
      <View>
        {isLoading && (
          <Progress.CircleSnail
            color={colors.gray}
            size={ICON_SIZE + 6}
            borderWidth={0}
            spinDuration={2000}
            thickness={3}
            style={styles.loadingWheel}
          />
        )}
        <Icon width={ICON_SIZE} height={ICON_SIZE} />
      </View>
    )
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
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      {getVehicleIconStyled(isLoading, () => icon(isPressed ? true : show))}
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
  loadingWheel: {
    position: 'absolute',
    zIndex: 2,
    top: -3,
    left: -3,
    width: ICON_SIZE + 6,
    height: ICON_SIZE + 6,
  },
})

export default VehicleBar
