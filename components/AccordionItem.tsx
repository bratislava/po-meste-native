import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

import ChevronRightSmall from '@icons/chevron-right-small.svg'
import { colors } from '@utils/theme'

export type AccordionStyles = {
  [key in keyof typeof defaultStyles]?: ViewStyle
}

interface AccorionItemProps {
  isOpen?: boolean
  onPress?: () => void
  title: ReactNode | string
  body: ReactNode | string
  overrideStyles?: AccordionStyles
  arrowIcon?: (isOpen: boolean) => JSX.Element
}

const AccordionItem = ({
  isOpen = false,
  onPress,
  title,
  body,
  overrideStyles,
  arrowIcon,
}: AccorionItemProps) => {
  const [maxHeight, setMaxHeight] = useState(0)

  const animation = useRef(new Animated.Value(0)).current

  const playOpenAnimation = useCallback(() => {
    Animated.timing(animation, {
      useNativeDriver: false,
      toValue: maxHeight,
      duration: 200,
    }).start()
  }, [animation, maxHeight])

  const playCloseAnimation = useCallback(() => {
    Animated.timing(animation, {
      useNativeDriver: false,
      toValue: 0,
      duration: 200,
    }).start()
  }, [animation])

  useEffect(() => {
    if (isOpen) {
      playOpenAnimation()
    } else playCloseAnimation()
  }, [isOpen, playOpenAnimation, playCloseAnimation])

  const styles = overrideStyles ?? defaultStyles

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        {typeof title === 'string' ? (
          <Text style={styles.title}>{title}</Text>
        ) : (
          title
        )}
        <View style={styles.arrowContainer}>
          {arrowIcon ? (
            arrowIcon(isOpen)
          ) : (
            <ChevronRightSmall
              width={16}
              height={16}
              fill={colors.tertiary}
              style={[
                { transform: [{ rotate: isOpen ? '270deg' : '90deg' }] },
                styles.arrow,
              ]}
            />
          )}
        </View>
      </View>
      <Animated.View style={{ height: animation }}>
        <View
          style={styles.bodyContainer}
          onLayout={(event) =>
            setMaxHeight(event.nativeEvent.layout.height + 20)
          }
        >
          {typeof body === 'string' ? (
            <Text style={styles.bodyContainerText}>{body}</Text>
          ) : (
            body
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  )
}

/* eslint-disable react-native/no-unused-styles */
const defaultStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '600',
  },
  arrowContainer: {},
  arrow: { backgroundColor: colors.tertiary },
  bodyContainer: {
    marginTop: 20,
    position: 'absolute',
  },
  bodyContainerText: {
    height: 'auto',
  },
})

export default AccordionItem
