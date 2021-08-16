import React, { useMemo } from 'react'
import MapView, { Marker } from 'react-native-maps'
import { StyleSheet, View } from 'react-native'
import { useQuery } from 'react-query'
import { getMhdStops } from '../utils/api'
import { apiMhdStops } from '../utils/validation'
import TicketSvg from '../assets/images/ticket.svg'
import SearchBar from './ui/SearchBar/SearchBar'
import VehicleBar from './ui/VehicleBar/VehicleBar'
import useRekolaData from '../hooks/useRekolaData'
import LoadingView from './ui/LoadingView/LoadingView'

export default function MapScreen() {
  // TODO handle loading / error
  const { data: dataMhd } = useQuery('getMhdStops', getMhdStops)

  const validatedMhdStops = useMemo(
    () => apiMhdStops.validateSync(dataMhd),
    [dataMhd]
  )

  const { dataMerged: dataMergedRekola, loading } = useRekolaData()
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
        {validatedMhdStops?.map((stop) => (
          <Marker
            key={stop.id}
            coordinate={{ latitude: stop.lat, longitude: stop.lon }}
            tracksViewChanges={false}
          >
            <View style={styles.marker}>
              <TicketSvg width={30} height={40} fill={'red'} />
            </View>
          </Marker>
        ))}
        {dataMergedRekola?.reduce<JSX.Element[]>((accumulator, station) => {
          if (station.lat && station.lon && station.station_id) {
            const marker = (
              <Marker
                key={station.station_id}
                coordinate={{ latitude: station.lat, longitude: station.lon }}
                tracksViewChanges={false}
              >
                <View style={styles.marker}>
                  <TicketSvg width={30} height={40} fill={'pink'} />
                </View>
              </Marker>
            )
            return accumulator.concat(marker)
          }
          return accumulator
        }, [])}
      </MapView>

      {loading ? <LoadingView /> : null}

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
