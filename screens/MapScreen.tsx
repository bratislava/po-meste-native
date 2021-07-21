import React, { useMemo } from "react"
import MapView, { Marker } from "react-native-maps"
import { StyleSheet, Text, View, Dimensions } from "react-native"
import { useQuery } from "react-query"
import { getMhdStops } from "../utils/api"
import { apiMhdStops } from "../utils/validation"

export default function MapScreen() {
  // TODO handle loading / error
  const { data } = useQuery("getMhdStops", getMhdStops)

  const validatedStops = useMemo(() => apiMhdStops.validateSync(data), [data])

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
        {validatedStops?.map((stop) => (
          <Marker coordinate={{ latitude: stop.lat, longitude: stop.lon }} />
        ))}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
})
