import React, { useState, createContext, Dispatch, SetStateAction } from 'react'

interface Props {
  children: React.ReactNode
}

interface ContextProps {
  isFeedbackSent: boolean
  setFeedbackSent: Dispatch<SetStateAction<boolean>>
}

export const GlobalStateContext = createContext({} as ContextProps)

export default function GlobalStateProvider({ children }: Props) {
  const [isFeedbackSent, setFeedbackSent] = useState(false)

  return (
    <GlobalStateContext.Provider
      value={{
        isFeedbackSent,
        setFeedbackSent,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  )
}
