import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react'
import { PreferredLanguage, VehicleType } from '../types'
import MhdSvg from '@images/mhd.svg'
import TicketSvg from '@images/ticket.svg'
import i18n from 'i18n-js'
import {
  loadPreferredLanguageFromAsyncStorage,
  savePreferredLanguageToAsyncStorage,
} from '@utils/localization'
import * as ExpoLocalization from 'expo-localization'

interface Props {
  children: React.ReactNode
}

interface ContextProps {
  preferredLanguage: PreferredLanguage
  changePreferredLanguage: (lang: PreferredLanguage) => void
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
  const [preferredLanguage, setPreferredLanguage] = useState<PreferredLanguage>(
    PreferredLanguage.auto
  )

  loadPreferredLanguageFromAsyncStorage().then((langugage) => {
    changePreferredLanguage(langugage)
  })

  const changePreferredLanguage = useCallback(
    (language: PreferredLanguage) => {
      savePreferredLanguageToAsyncStorage(language)
      setPreferredLanguage(language)
      i18n.locale =
        language == PreferredLanguage.auto
          ? ExpoLocalization.locale?.split('-')[0]
          : language
    },
    [setPreferredLanguage]
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
        changePreferredLanguage,
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
