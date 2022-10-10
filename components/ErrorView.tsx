import Text from '@components/Text'
import * as Sentry from '@sentry/react-native'
import i18n from 'i18n-js'
import React, { useEffect } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useNetInfo } from '@react-native-community/netinfo'
import { isApiError, isNetworkError, isValidationError } from '@utils'
import { colors } from '@utils/theme'
import Button from './Button'

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
  const netInfo = useNetInfo()
  useEffect(() => {
    if (__DEV__) {
      return
    }
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
    } else if (isNetworkError(error) && !netInfo.isConnected) {
      Sentry.captureException(error, {
        extra: {
          exceptionType: 'network error',
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
    return <Text>{i18n.t('components.ErrorView.validationError')}</Text>
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
          {errorMessage || i18n.t('components.ErrorView.errorViewTitle')}
        </Text>
        <Text style={styles.bodyText}>
          {(isNetworkError(error) &&
            !netInfo.isConnected &&
            i18n.t('components.ErrorView.disconnectedError')) ||
            error?.toString() ||
            i18n.t('components.ErrorView.errorViewBody')}
        </Text>
        {action && (
          <Button
            title={i18n.t('components.ErrorView.errorViewActionText')}
            variant="secondary"
            onPress={() => action()} // on purpose
            style={styles.action}
          />
        )}
        {reset && (
          <Button
            title={i18n.t('components.ErrorView.errorViewResetText')}
            variant="primary"
            onPress={reset}
            style={styles.action}
          />
        )}
        {cancel && (
          <Button
            title={i18n.t('components.ErrorView.errorViewCancelText')}
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
