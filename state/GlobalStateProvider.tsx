import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react'
import { SvgProps } from 'react-native-svg'

import i18n from 'i18n-js'
import * as ExpoLocalization from 'expo-localization'
import {
  loadPreferredLanguageFromAsyncStorage,
  savePreferredLanguageToAsyncStorage,
} from '@utils/localization'

import { PreferredLanguage, VehicleType } from '@types'

import MhdChosenSvg from '@icons/map-filters/mhd-filter-chosen.svg'
import MhdUnchosenSvg from '@icons/map-filters/mhd-filter-unchosen.svg' // TODO add proper icon
import BicyclesChosen from '@icons/map-filters/bicycles-filter-chosen.svg'
import BicyclesUnchosen from '@icons/map-filters/bicycles-filter-unchosen.svg'
import ScooterChosen from '@icons/map-filters/scooters-filter-chosen.svg'
import ScooterUnchosen from '@icons/map-filters/scooters-filter-unchosen.svg'
import ChargersChosen from '@icons/map-filters/chargers-filter-chosen.svg'
import ChargersUnchosen from '@icons/map-filters/chargers-filter-unchosen.svg'

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
  icon: (show: boolean) => React.FC<SvgProps>
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
