import { Marker } from 'react-native-maps'

export default function MarkerWithIndex({ marker, index }) {
    return <Marker {...marker} />
}
