import React, { useState, createContext, Dispatch, SetStateAction } from 'react'
import { VehicleType } from '../types'
import MhdSvg from '@images/mhd.svg'
import TicketSvg from '@images/ticket.svg'

interface Props {
  children: React.ReactNode
}

interface ContextProps {
  vehicleTypes: VehicleProps[]
  setVehicleTypes: Dispatch<SetStateAction<VehicleProps[]>>
  timeLineNumber?: number
  setTimeLineNumber: React.Dispatch<React.SetStateAction<number | undefined>>
  isFeedbackSent: boolean
  setFeedbackSent: Dispatch<SetStateAction<boolean>>
}

interface VehicleProps {
  id: string
  show: boolean
  icon: (color: string) => React.ReactNode
}

export const GlobalStateContext = createContext({} as ContextProps)

export default function GlobalStateProvider({ children }: Props) {
  const [timeLineNumber, setTimeLineNumber] = useState<number>()

  const [vehicleTypes, setVehicleTypes] = useState<VehicleProps[]>([
    {
      id: VehicleType.mhd,
      show: true,
      icon: (color: string) => <MhdSvg fill={color} />, //TODO change for vehicle icon
    },
    {
      id: VehicleType.bicycle,
      show: true,
      icon: (color: string) => <TicketSvg fill={color} />, //TODO change for vehicle icon
    },
    {
      id: VehicleType.scooter,
      show: true,
      icon: (color: string) => <TicketSvg fill={color} />, //TODO change for vehicle icon
    },
    {
      id: VehicleType.chargers,
      show: true,
      icon: (color: string) => <TicketSvg fill={color} />, //TODO change for vehicle icon
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
