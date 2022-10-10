import React from 'react'
import {
  Falsy,
  RecursiveArray,
  RegisteredStyle,
  Text as NativeText,
  TextProps as NativeTextProps,
  TextStyle,
} from 'react-native'

interface TextProps extends NativeTextProps {
  variant?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge'
}

type NotRegisteredStyle = Exclude<
  TextProps['style'],
  | RegisteredStyle<TextStyle>
  | Falsy
  | RecursiveArray<Falsy | TextStyle | RegisteredStyle<TextStyle>>
>

const findFontWeight = (style: TextProps['style']): 'normal' | 'bold' => {
  if (!style) return 'normal'
  let fontWeight = ''
  if (Array.isArray(style)) {
    fontWeight =
      (
        style.find(
          (s) =>
            s &&
            typeof s === 'object' &&
            !Array.isArray(s) &&
            !!(s as TextStyle)?.fontWeight
        ) as TextStyle
      )?.fontWeight ?? 'normal'
  } else if (typeof style === 'object') {
    fontWeight = style.fontWeight ?? 'normal'
  } else return 'normal'
  return ['bold', '600', '700', '800', '900'].includes(fontWeight)
    ? 'bold'
    : 'normal'
}

const Text = ({ style, ...props }: TextProps) => {
  const fontWeight = findFontWeight(style)
  return (
    <NativeText
      {...props}
      style={[
        {
          fontFamily:
            fontWeight && fontWeight !== 'normal'
              ? 'work-sans-bold'
              : 'work-sans',
        },
        style,
      ]}
    ></NativeText>
  )
}

export default Text
