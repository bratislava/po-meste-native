import React, { useContext } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

import { GlobalStateContext } from '@components/GlobalStateProvider'

import ThumbUp from '@images/thumb-up.svg'
import ThumbDown from '@images/thumb-down.svg'

import { colors } from '@utils/theme'

export type FeedbackProps = {
  onPositiveFeedbackPress: () => void
  onNegativeFeedbackPress: () => void
}

const Feedback = ({
  onNegativeFeedbackPress,
  onPositiveFeedbackPress,
}: FeedbackProps) => {
  const { isFeedbackSent } = useContext(GlobalStateContext)

  if (!isFeedbackSent) {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Váš názor je pre nás dôležitý!</Text>
          <Text style={styles.subtitle}>Ako hodnotíte navrhnuté trasy?</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.thumbDownButton}
            onPress={onNegativeFeedbackPress}
          >
            <ThumbDown
              fill={colors.primary}
              stroke={c.background}
              strokeWidth={1}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.thumbUpButton}
            onPress={onPositiveFeedbackPress}
          >
            <ThumbUp
              fill={colors.primary}
              stroke={c.background}
              strokeWidth={1}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.thumbUpButtonAfterFeedback}>
          <ThumbUp
            fill={colors.primary}
            stroke={c.background}
            strokeWidth={1}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Ďakujeme za hodnotenie!</Text>
          <Text style={styles.subtitle}>
            Vaša odozva nám pomáha zlepšovať appku :)
          </Text>
        </View>
      </View>
    )
  }
}

const c = {
  background: colors.lightLightGray,
  title: colors.primary,
  subtitle: colors.darkText,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: c.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flexShrink: 1,
  },
  title: {
    color: c.title,
  },
  subtitle: {
    color: c.subtitle,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbUpButtonAfterFeedback: {
    marginVertical: 4,
    marginRight: 10,
  },
  thumbDownButton: {
    marginTop: 8,
  },
  thumbUpButton: {
    marginBottom: 8,
    marginLeft: 20,
  },
})

export default Feedback
