import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react'
import { PrefferedLanguage, VehicleType } from '../types'
import MhdSvg from '@images/mhd.svg'
import TicketSvg from '@images/ticket.svg'
import i18n from 'i18n-js'
import {
  loadPrefferedLanguageFromAsyncStorage,
  savePrefferedLanguageToAsyncStorage,
} from '@utils/localization'
import * as ExpoLocalization from 'expo-localization'

interface Props {
  children: React.ReactNode
}

interface ContextProps {
  preferredLanguage: PrefferedLanguage
  changePrefferedLangugage: (lang: PrefferedLanguage) => void
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
  icon: (color: string) => React.ReactNode
}

export const GlobalStateContext = createContext({} as ContextProps)

export default function GlobalStateProvider({ children }: Props) {
  const [preferredLanguage, setPrefferedLangugage] =
    useState<PrefferedLanguage>(PrefferedLanguage.auto)

  loadPrefferedLanguageFromAsyncStorage().then((langugage) => {
    changePrefferedLangugage(langugage)
  })

  const changePrefferedLangugage = useCallback(
    (language: PrefferedLanguage) => {
      savePrefferedLanguageToAsyncStorage(language)
      setPrefferedLangugage(language)
      i18n.locale =
        language == PrefferedLanguage.auto
          ? ExpoLocalization.locale?.split('-')[0]
          : language
    },
    [setPrefferedLangugage]
  )

  const [timeLineNumber, setTimeLineNumber] = useState<string>()

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
        preferredLanguage,
        changePrefferedLangugage,
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
