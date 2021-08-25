import React, { useMemo, useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import i18n from 'i18n-js'

import { Button } from '../components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { useQuery } from 'react-query'
import { useNavigation } from '@react-navigation/native'
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete'
import Constants from 'expo-constants'

import { default as CustomButton } from '../components/Button'
import { getTripPlanner } from '../utils/api'
import { apiOtpPlanner } from '../utils/validation'

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

  useEffect(() => {
    refetch()
  }, [from, to])

  const validatedOtpData = useMemo(() => {
    try {
      const validatedData = apiOtpPlanner.validateSync(data)
      return validatedData
    } catch (e) {
      setValidationErrors(e.errors)
      console.log(e)
    }
  }, [data])

  const onPlaceChosen = (
    details: GooglePlaceDetail | null = null,
    set: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (details?.geometry.location.lat && details?.geometry.location.lng) {
      set(`${details?.geometry.location.lat},${details?.geometry.location.lng}`)
    }
  }

  const onPlaceFromChosen = (
    _data: GooglePlaceData,
    details: GooglePlaceDetail | null = null
  ) => {
    onPlaceChosen(details, setFrom)
  }

  const onPlaceToChosen = (
    _data: GooglePlaceData,
    details: GooglePlaceDetail | null = null
  ) => {
    onPlaceChosen(details, setTo)
  }

  return (
    <>
      <GooglePlacesAutocomplete
        fetchDetails
        styles={styles.googleFrom}
        placeholder={i18n.t('from')}
        onPress={onPlaceFromChosen}
        query={{
          key: Constants.manifest?.extra?.googlePlacesApiKey,
          language: 'sk',
          components: 'country:sk',
        }}
      />
      <GooglePlacesAutocomplete
        fetchDetails
        styles={styles.googleFrom}
        placeholder={i18n.t('to')}
        onPress={onPlaceToChosen}
        query={{
          key: Constants.manifest?.extra?.googlePlacesApiKey,
          language: 'sk',
          components: 'country:sk',
        }}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.buttonFullWidth}>
          <Button
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
                  <Text>{new Date(tripChoice.startTime).toISOString()}</Text>
                  <Text>{new Date(tripChoice.endTime).toISOString()}</Text>
                </TouchableOpacity>
              </View>
            )
          })}
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  scrollView: {
    minWidth: '100%',
    borderWidth: 1,
  },
  googleFrom: {
    flex: 1,
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
