import React, { useCallback, useMemo } from 'react'
import MapView, { Marker } from 'react-native-maps'
import { StyleSheet, View } from 'react-native'
import { useQuery } from 'react-query'
import TicketSvg from '../assets/images/ticket.svg'
import SearchBar from './ui/SearchBar/SearchBar'
import VehicleBar from './ui/VehicleBar/VehicleBar'
import LoadingView from './ui/LoadingView/LoadingView'
import useRekolaData from '../hooks/useRekolaData'
import useSlovnaftbajkData from '../hooks/useSlovnaftbajkData'
import useTierData from '../hooks/useTierData'
import useMhdData from '../hooks/useMhdData'
import useZseChargersData from '../hooks/useZseChargersData'

interface DataStations {
  station_id: string
  name?: string | undefined
  lat?: number | undefined
  lon?: number | undefined
  is_virtual_station?: boolean | undefined
  num_bikes_available: number
  is_installed: number
  is_renting: number
  is_returning: number
  last_reported: string
}

export default function MapScreen() {
  // TODO handle loading / error
  const { data: dataMhd, isLoading: isLoadingMhd } = useMhdData()
  const { data: dataTier, isLoading: isLoadingTier } = useTierData()
  const { data: dataZseChargers, isLoading: isLoadingZseChargers } =
    useZseChargersData()
  const { data: dataMergedRekola, isLoading: isLoadingRekola } = useRekolaData()
  const { data: dataMergedSlovnaftbajk, isLoading: isLoadingSlovnaftbajk } =
    useSlovnaftbajkData()

  const renderStations = useCallback(
    (data: DataStations[] | undefined, color: string) => {
      return data?.reduce<JSX.Element[]>((accumulator, station) => {
        if (station.lat && station.lon && station.station_id) {
          const marker = (
            <Marker
              key={station.station_id}
              coordinate={{ latitude: station.lat, longitude: station.lon }}
              tracksViewChanges={false}
            >
              <View style={styles.marker}>
                <TicketSvg width={30} height={40} fill={color} />
              </View>
            </Marker>
          )
          return accumulator.concat(marker)
        }
        return accumulator
      }, [])
    },
    []
  )

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 48.1512015,
          longitude: 17.1110118,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {dataMhd?.map((stop) => (
          <Marker
            key={stop.stationStopId}
            coordinate={{
              latitude: parseFloat(stop.gpsLat),
              longitude: parseFloat(stop.gpsLon),
            }}
            tracksViewChanges={false}
          >
            <View style={styles.marker}>
              <TicketSvg width={30} height={40} fill={'red'} />
            </View>
          </Marker>
        ))}
        {dataTier?.map((vehicle) => {
          return (
            <Marker
              key={vehicle.bike_id}
              coordinate={{ latitude: vehicle.lat, longitude: vehicle.lon }}
              tracksViewChanges={false}
            >
              <View style={styles.marker}>
                <TicketSvg width={30} height={40} fill={'blue'} />
              </View>
            </Marker>
          )
        })}

        {renderStations(dataMergedRekola, 'pink')}
        {renderStations(dataMergedSlovnaftbajk, 'yellow')}
        {dataZseChargers?.reduce<JSX.Element[]>((accumulator, charger) => {
          if (charger.coordinates.latitude && charger.coordinates.longitude) {
            const marker = (
              <Marker
                key={charger.id}
                coordinate={{
                  latitude: charger.coordinates.latitude,
                  longitude: charger.coordinates.longitude,
                }}
                tracksViewChanges={false}
              >
                <View style={styles.marker}>
                  <TicketSvg width={30} height={40} fill={'green'} />
                </View>
              </Marker>
            )
            return accumulator.concat(marker)
          } else return accumulator
        }, [])}
      </MapView>

      {isLoadingMhd ||
      isLoadingRekola ||
      isLoadingSlovnaftbajk ||
      isLoadingTier ||
      isLoadingZseChargers ? (
        <LoadingView />
      ) : null}
      <SearchBar />
      <VehicleBar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})
