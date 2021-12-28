import * as Sentry from '@sentry/react-native'
import React, { useEffect } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import i18n from 'i18n-js'

import { colors } from '@utils/theme'
import { Button } from '.'
import { isApiError, isValidationError } from '@utils/utils'

interface ErrorViewProps {
  action?: () => unknown
  reset?: () => unknown
  cancel?: () => unknown
  isFullscreen?: boolean
  styleWrapper?: StyleProp<ViewStyle>
}

interface ErrorViewPropsError extends ErrorViewProps {
  error?: any
}

interface ErrorViewPropsErrorMessage extends ErrorViewProps {
  errorMessage?: string
}

interface ErrorViewMerged
  extends ErrorViewPropsError,
    ErrorViewPropsErrorMessage {}

const ErrorView = ({
  error,
  errorMessage,
  action,
  reset,
  cancel,
  isFullscreen,
  styleWrapper,
}: ErrorViewMerged) => {
  useEffect(() => {
    if (isValidationError(error)) {
      Sentry.captureException(error, {
        extra: {
          exceptionType: 'validation error',
          rawData: JSON.stringify(error),
        },
      })
    } else if (isApiError(error)) {
      Sentry.captureException(error, {
        extra: {
          exceptionType: 'api error manual',
          rawData: JSON.stringify(error),
        },
      })
    } else if (error) {
      Sentry.captureException(error, {
        extra: {
          exceptionType: 'other error',
          rawData: JSON.stringify(error),
        },
      })
    } else if (errorMessage) {
      Sentry.captureMessage(errorMessage, Sentry.Severity.Error)
    }
  }, [error, errorMessage])

  if (isValidationError(error)) {
    // TODO add proper error message
    return <Text>{i18n.t('validationError')}</Text>
  }

  return (
    <View
      style={[
        styles.wrapper,
        styleWrapper,
        isFullscreen ? styles.fullscreen : null,
      ]}
    >
      <View style={styles.container}>
        <Text style={styles.error}>
          {errorMessage || i18n.t('errorViewTitle')}
        </Text>
        <Text style={styles.bodyText}>{i18n.t('errorViewBody')}</Text>
        {action && (
          <Button
            title={i18n.t('errorViewActionText')}
            variant="secondary"
            onPress={() => action()} // on purpose
            style={styles.action}
          />
        )}
        {reset && (
          <Button
            title={i18n.t('errorViewResetText')}
            variant="primary"
            onPress={reset}
            style={styles.action}
          />
        )}
        {cancel && (
          <Button
            title={i18n.t('errorViewCancelText')}
            variant="primary"
            onPress={cancel}
            style={styles.action}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  fullscreen: {
    flexGrow: 1,
  },
  wrapper: {
    marginVertical: 20,
    justifyContent: 'center',
  },
  container: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderTopColor: colors.primary,
    borderTopWidth: 4,
    borderRadius: 4,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  error: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  bodyText: {
    textAlign: 'center',
  },
  action: {
    marginTop: 20,
  },
})

export default ErrorView
