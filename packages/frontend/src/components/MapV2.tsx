import React, { useEffect } from 'react';
import maplibregl, { LngLat, LngLatBounds } from 'maplibre-gl';
import { withIdentityPoolId } from "@aws/amazon-location-utilities-auth-helper";


interface InitializeMapProps {
  identityPoolId: string;
  mapName: string;
}

const InitializeMap: React.FC<InitializeMapProps> = ({ identityPoolId, mapName }) => {
  useEffect(() => {
    const initializeMap = async () => {
      // extract the region from the Identity Pool ID
      const region = identityPoolId.split(":")[0];

      // Create an authentication helper instance using credentials from Cognito
      const authHelper = await withIdentityPoolId(identityPoolId);

      // Set a bounds to Bahrain, Bahrain
      let bound = new LngLatBounds(
        new LngLat(50.3, 25.5357),
        new LngLat(50.8120, 26.3870)
      );

      // Initialize the map
      const map = new maplibregl.Map({
        container: "map",
        center: [50.5860, 26.15],
        zoom: 10,
        maxBounds: bound,
        style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor`,
        ...authHelper.getMapAuthenticationOptions(),
      });
      map.addControl(new maplibregl.NavigationControl(), "top-left");
    
      // Add 3D buildings after the map loads
      map.on('load', () => {
        // Insert the layer beneath any symbol layer.
      
      
        map.addSource('openmaptiles', {
          url: `https://api.maptiler.com/tiles/v3/tiles.json?key=UGho1CzUl0HDsQMTTKJ0`,
          type: 'vector',
        });
      
        map.addLayer(
          {
            'id': '3d-buildings',
            'source': 'openmaptiles',
            'source-layer': 'building',
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
              'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['get', 'render_height'], 0, 'lightgray', 200, 'royalblue', 400, 'lightblue'
              ],
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                16,
                ['get', 'render_height']
              ],
              'fill-extrusion-base': ['case',
                ['>=', ['get', 'zoom'], 16],
                ['get', 'render_min_height'], 0
              ]
            }
          },
        );
      });
    };
      

    initializeMap();

    // Clean up
    return () => {
      // Do cleanup if needed
    };
  }, [identityPoolId, mapName]);

  return <div id="map" style={{ width: '100%', height: '100vh' }} />;
};

export default InitializeMap;
