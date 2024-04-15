import { Map, GeolocateControl } from 'maplibre-gl';

function MyMap() {
  return (
    <Map 
      style="mapbox://styles/mapbox/streets-v11"
      containerStyle={{
        height: '400px',
        width: '100%'
      }}
      center={[50.507931, 26.047119]}
      zoom={14}
    >
    </Map>
  )
}
