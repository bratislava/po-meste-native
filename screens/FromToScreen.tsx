import React, { useMemo, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import i18n from 'i18n-js'

import { default as CustomButton } from '../components/Button'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { getTripPlanner } from '../utils/api'
import { useQuery } from 'react-query'
import { apiOtpPlanner } from '../utils/validation'
import { useNavigation } from '@react-navigation/native'

export default function FromToScreen() {
  const navigation = useNavigation()
  const [validationErrors, setValidationErrors] = useState()
  const [from, setFrom] = useState('48.1268706888398,17.173025608062744')
  const [to, setTo] = useState('48.1611619575192,17.165794372558594')
  const { data, isLoading, error, refetch } = useQuery(
    'getOtpData',
    () => getTripPlanner(from, to),
    {
      enabled: false,
    }
  )
  const planTrip = () => {
    refetch()
  }

  const validatedOtpData = useMemo(() => {
    try {
      const validatedData = apiOtpPlanner.validateSync(data)
      return validatedData
    } catch (e) {
      setValidationErrors(e.errors)
      console.log(e)
    }
  }, [data])

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.title}
        onChangeText={setFrom}
        value={from}
        placeholder={i18n.t('from')}
      />
      <TextInput
        style={styles.title}
        onChangeText={setTo}
        value={to}
        placeholder={i18n.t('to')}
      />
      <View style={styles.buttonFullWidth}>
        <CustomButton
          style={styles.ticketButton}
          title={i18n.t('findRoute')}
          onPress={() => planTrip()}
          isFullWidth
          size="large"
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {validatedOtpData?.plan?.itineraries?.map((tripChoice, index) => {
          return (
            <View style={styles.trip} key={index}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('PlannerScreen', {
                    legs: tripChoice?.legs,
                  })
                }
              >
                <Text>{`trip ${index} duration: ${tripChoice.duration}`}</Text>
                <Text>{tripChoice.endTime}</Text>
              </TouchableOpacity>
            </View>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    minWidth: '100%',
    borderWidth: 1,
  },
  title: {
    marginTop: 33,
    textTransform: 'uppercase',
  },
  buttonFullWidth: {
    flexDirection: 'row',
    marginHorizontal: 20,
    margin: 10,
  },
  trip: {
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  ticketButton: {
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
  },
  row: {
    flex: 1,
    width: '100%',
  },
})
