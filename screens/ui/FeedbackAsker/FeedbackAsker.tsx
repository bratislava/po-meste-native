import React, { useContext } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

import { GlobalStateContext } from '@components/GlobalStateProvider'

import ThumbUp from '@images/thumb-up.svg'
import ThumbDown from '@images/thumb-down.svg'

import { colors } from '@utils/theme'
import i18n from 'i18n-js'

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
          <Text style={styles.title}>
            {i18n.t('components.feedbackAsker.title')}
          </Text>
          <Text style={styles.subtitle}>
            {i18n.t('components.feedbackAsker.text')}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.thumbDownButton}
            onPress={onNegativeFeedbackPress}
          >
            <ThumbDown
              fill={colors.primary}
              stroke={colors.lightLightGray}
              strokeWidth={1}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.thumbUpButton}
            onPress={onPositiveFeedbackPress}
          >
            <ThumbUp
              fill={colors.primary}
              stroke={colors.lightLightGray}
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
            stroke={colors.lightLightGray}
            strokeWidth={1}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {i18n.t('components.feedbackAsker.thankYouTitle')}
          </Text>
          <Text style={styles.subtitle}>
            {i18n.t('components.feedbackAsker.thankYouText')}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
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
    color: colors.primary,
  },
  subtitle: {
    color: colors.darkText,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
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
