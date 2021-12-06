import React, { useState, createContext, Dispatch, SetStateAction } from 'react'

import MhdChosenSvg from '@images/mhd-filter-chosen.svg'
import MhdUnchosenSvg from '@images/mhd-filter-unchosen.svg' // TODO add proper icon
import BicyclesChosen from '@images/bicycles-filter-chosen.svg'
import BicyclesUnchosen from '@images/bicycles-filter-unchosen.svg'
import ScooterChosen from '@images/scooters-filter-chosen.svg'
import ScooterUnchosen from '@images/scooters-filter-unchosen.svg'
import ChargersChosen from '@images/chargers-filter-chosen.svg'
import ChargersUnchosen from '@images/chargers-filter-unchosen.svg'
import { VehicleType } from '../../types'
import { SvgProps } from 'react-native-svg'

interface Props {
  children: React.ReactNode
}

interface ContextProps {
  vehicleTypes: VehicleProps[]
  setVehicleTypes: Dispatch<SetStateAction<VehicleProps[]>>
  timeLineNumber?: string
  setTimeLineNumber: React.Dispatch<React.SetStateAction<string | undefined>>
  isFeedbackSent: boolean
  setFeedbackSent: Dispatch<SetStateAction<boolean>>
}

interface VehicleProps {
  id: string
  show: boolean
  icon: (show: boolean) => React.FC<SvgProps>
}

export const GlobalStateContext = createContext({} as ContextProps)

export default function GlobalStateProvider({ children }: Props) {
  const [timeLineNumber, setTimeLineNumber] = useState<string>()

  const [vehicleTypes, setVehicleTypes] = useState<VehicleProps[]>([
    {
      id: VehicleType.mhd,
      show: true,
      icon: (show) => (show ? MhdChosenSvg : MhdUnchosenSvg),
    },
    {
      id: VehicleType.bicycle,
      show: true,
      icon: (show) => (show ? BicyclesChosen : BicyclesUnchosen),
    },
    {
      id: VehicleType.scooter,
      show: true,
      icon: (show) => (show ? ScooterChosen : ScooterUnchosen),
    },
    {
      id: VehicleType.chargers,
      show: true,
      icon: (show) => (show ? ChargersChosen : ChargersUnchosen),
    },
  ])

  const [isFeedbackSent, setFeedbackSent] = useState(false)

  return (
    <GlobalStateContext.Provider
      value={{
        vehicleTypes,
        setVehicleTypes,
        timeLineNumber,
        setTimeLineNumber,
        isFeedbackSent,
        setFeedbackSent,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  )
}
