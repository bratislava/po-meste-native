import React, { useMemo, useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native'
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
      <SafeAreaView style={styles.container}>
        <View style={styles.googleFrom}>
          <GooglePlacesAutocomplete
            styles={autoCompleteStyles}
            enablePoweredByContainer={false}
            fetchDetails
            placeholder={i18n.t('from')}
            onPress={onPlaceFromChosen}
            query={{
              key: Constants.manifest?.extra?.googlePlacesApiKey,
              language: 'sk',
              components: 'country:sk',
            }}
          />
        </View>
        <View style={styles.googleFrom}>
          <GooglePlacesAutocomplete
            styles={autoCompleteStyles}
            enablePoweredByContainer={false}
            fetchDetails
            placeholder={i18n.t('to')}
            onPress={onPlaceToChosen}
            query={{
              key: Constants.manifest?.extra?.googlePlacesApiKey,
              language: 'sk',
              components: 'country:sk',
            }}
          />
        </View>

        <View style={styles.buttonFullWidth}>
          <Button
            style={styles.ticketButton}
            title={i18n.t('findRoute')}
            onPress={() => refetch()}
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
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  buttonFullWidth: {
    flexDirection: 'row',
    marginHorizontal: 10,
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
})

const autoCompleteStyles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-unused-styles
  container: {
    width: '100%',
  },
  // eslint-disable-next-line react-native/no-unused-styles
  listView: {
    position: 'absolute',
    top: 50,
    elevation: 5,
    zIndex: 5,
  },
})
