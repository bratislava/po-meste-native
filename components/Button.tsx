import React from "react"
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableHighlight,
  View,
  ViewStyle,
  Text,
} from "react-native"
import { colors } from "../utils/theme"

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 24,
    borderWidth: 1,
  },
  touchableFullWidth: {
    flex: 1,
  },
  touchableGrouped: {
    marginLeft: 16,
  },
  touchableGroupedSmall: {
    marginLeft: 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  small: {
    height: 32,
    borderRadius: 16,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  medium: {
    height: 40,
    borderRadius: 20,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  large: {
    height: 48,
    borderRadius: 24,
  },
  iconSpacing: {
    marginRight: 4,
  },
  lottieView: {
    height: 15,
  },
})

const disabledAlpha = "40" // 0.25

const COLORS = {
  backgroundColor: {
    primary: colors.primary,
    "primary-submit": colors.green,
    secondary: "transparent",
    filled: colors.secondary,
    tertiary: "transparent",
    danger: colors.error,
    chat: "transparent",
  },
  disabledBackgroundColor: {
    primary: colors.gray,
    "primary-submit": colors.gray,
    secondary: "transparent",
    filled: `${colors.secondary}${disabledAlpha}`,
    tertiary: "transparent",
    danger: `${colors.error}${disabledAlpha}`,
    chat: "transparent",
  },
  underlayColor: {
    primary: colors.primary,
    "primary-submit": colors.primary,
    secondary: colors.secondary,
    filled: colors.secondary,
    tertiary: "#e5e5e5",
    danger: colors.error,
    chat: "#e5e5e5",
  },
  iconColor: {
    primary: colors.white,
    "primary-submit": colors.white,
    secondary: colors.secondary,
    tertiary: colors.lightText,
    filled: colors.white,
    danger: colors.white,
    chat: colors.darkText,
  },
  textColor: {
    primary: colors.white,
    "primary-submit": colors.white,
    secondary: colors.secondary,
    tertiary: colors.lightText,
    filled: colors.white,
    danger: colors.white,
    chat: colors.darkText,
  },
  borderColor: {
    primary: "transparent",
    "primary-submit": "transparent",
    secondary: colors.secondary,
    filled: "transparent",
    tertiary: "transparent",
    danger: "transparent",
    chat: "transparent",
  },
  disabledBorderColor: {
    primary: "transparent",
    "primary-submit": "transparent",
    secondary: `${colors.secondary}${disabledAlpha}`,
    filled: "transparent",
    tertiary: "transparent",
    danger: "transparent",
    chat: "transparent",
  },
}

type FontWeightType =
  | "normal"
  | "bold"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"

const FONT_WEIGHT: { [key: string]: FontWeightType } = {
  primary: "normal",
  "primary-submit": "bold",
  secondary: "normal",
  tertiary: "normal",
  filled: "normal",
  danger: "normal",
  chat: "normal",
}
interface ButtonProps {
  onPress: (event: GestureResponderEvent) => void
  title?: string
  icon?: IconName
  isGrouped?: boolean
  isFullWidth?: boolean
  variant?: "primary" | "primary-submit" | "secondary" | "tertiary" | "filled" | "danger" | "chat"
  size?: "small" | "medium" | "large"
  style?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  disabled?: boolean
  loading?: boolean
  testID?: string
}

const Button = ({
  title,
  onPress,
  variant = "primary",
  icon,
  isGrouped,
  isFullWidth,
  size = "medium",
  disabled,
  style,
  titleStyle,
  loading,
  testID,
}: ButtonProps) => {
  const showDisabledStyle = disabled && !loading

  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={COLORS.underlayColor[variant]}
      disabled={disabled || loading}
      style={[
        styles.touchable,
        isGrouped && styles.touchableGrouped,
        isGrouped && size === "small" && styles.touchableGroupedSmall,
        isFullWidth && styles.touchableFullWidth,
        {
          backgroundColor: showDisabledStyle
            ? COLORS.disabledBackgroundColor[variant]
            : COLORS.backgroundColor[variant],
          borderColor: showDisabledStyle
            ? COLORS.disabledBorderColor[variant]
            : COLORS.borderColor[variant],
        },
        style,
      ]}
      testID={testID}
    >
      <View style={[styles.container, styles[size]]}>
        {loading ? (
          <Text
            style={[
              { color: COLORS.textColor[variant], fontWeight: FONT_WEIGHT[variant] },
              titleStyle,
            ]}
          >
            Loading...
          </Text>
        ) : (
          <>
            {!!title && (
              <Text
                style={[
                  { color: COLORS.textColor[variant], fontWeight: FONT_WEIGHT[variant] },
                  titleStyle,
                ]}
              >
                {title}
              </Text>
            )}
          </>
        )}
      </View>
    </TouchableHighlight>
  )
}

export default Button
