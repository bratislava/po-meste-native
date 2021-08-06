import React, { useMemo } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import { useQuery } from "react-query";
import { getMhdStops } from "../utils/api";
import { apiMhdStops } from "../utils/validation";
import Svg, { Circle, Rect } from "react-native-svg";
import TicketSvg from "../assets/images/ticket.svg";

export default function MapScreen() {
  // TODO handle loading / error
  const { data } = useQuery("getMhdStops", getMhdStops);

  const validatedStops = useMemo(() => apiMhdStops.validateSync(data), [data]);

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
          <Marker
            key={stop.id}
            coordinate={{ latitude: stop.lat, longitude: stop.lon }}
            tracksViewChanges={false}
          >
            <View style={styles.marker}>
              <TicketSvg width={120} height={40} fill={"red"} />
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
