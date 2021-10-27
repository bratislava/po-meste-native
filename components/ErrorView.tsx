import * as Sentry from '@sentry/react-native'
import React, { useCallback, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import i18n from 'i18n-js'
import { ValidationError } from 'yup'

import { colors } from '@utils/theme'
import { Button } from '.'

interface ErrorViewProps {
  action?: () => unknown
  reset?: () => unknown
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

const ErrorView = ({ error, errorMessage, action, reset }: ErrorViewMerged) => {
  const isValidationError = useCallback(
    (error) => error instanceof ValidationError,
    []
  )

  useEffect(() => {
    if (isValidationError(error)) {
      Sentry.captureException(error, {
        extra: {
          exceptionType: 'validation error',
          rawData: JSON.stringify(error),
        },
      })
    }
    if (error) {
      Sentry.captureException(error, {
        extra: {
          exceptionType: 'other error',
          rawData: JSON.stringify(error),
        },
      })
    } else if (errorMessage) {
      Sentry.captureMessage(errorMessage, Sentry.Severity.Error)
    }
  }, [isValidationError, error, errorMessage])

  if (isValidationError(error)) {
    // TODO add proper error message
    return <Text>{i18n.t('validationError')}</Text>
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.error}>
          {errorMessage || i18n.t('errorViewTitle')}
        </Text>
        <Text style={styles.bodyText}>{i18n.t('errorViewBody')}</Text>
        {action && (
          <Button
            title={i18n.t('actionText')}
            variant="secondary"
            onPress={() => action()} // on purpose
            style={styles.action}
          />
        )}
        {reset && (
          <Button
            title={i18n.t('resetText')}
            variant="primary"
            onPress={reset}
            style={styles.action}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
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
