import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { StyleSheet, Text, View, Animated } from 'react-native'

import ChevronRightSmall from '@icons/chevron-right-small.svg'
import { colors } from '@utils/theme'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface AccorionItemProps {
  isOpen?: boolean
  onPress?: () => void
  title: string
  body: ReactNode | string
}

const AccordionItem = ({
  isOpen = false,
  onPress,
  title,
  body,
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

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.arrowContainer}>
          <ChevronRightSmall width={16} height={16} fill={colors.tertiary} />
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
            { body }
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
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
  bodyContainer: {
    marginTop: 20,
    position: 'absolute',
  },
  bodyContainerText: {
    height: 'auto',
  },
})

export default AccordionItem
