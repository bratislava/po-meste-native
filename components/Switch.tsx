import { colors } from '@utils/theme'
import React from 'react'
import { SwitchProps as ReactSwitchProps } from 'react-native'

const Switch = ({ ...props }: ReactSwitchProps) => {
  return (
    <Switch
      trackColor={{ false: '#E1E4E8', true: '#ADCD00' }}
      thumbColor={colors.white}
      ios_backgroundColor="#E1E4E8"
      {...props}
    />
  )
}

export default Switch
