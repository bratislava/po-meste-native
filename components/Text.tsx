import React from 'react'
import { Text as NativeText, TextProps as NativeTextProps } from 'react-native'

type TextProps = {
  variant: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge'
} & NativeTextProps

const Text = (props: TextProps) => {
  return <NativeText {...props}></NativeText>
}

export default Text
