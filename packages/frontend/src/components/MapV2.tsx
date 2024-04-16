// MapV2.tsx
import React, { useEffect } from 'react';
import maplibregl, { LngLat, LngLatBounds } from 'maplibre-gl';
import { withIdentityPoolId } from "@aws/amazon-location-utilities-auth-helper";
import SolarPanelCalculator from './SolarPanelCalculator';

interface MapV2Props {
  identityPoolId: string;
  mapName: string;
}

const MapV2: React.FC<MapV2Props> = ({ identityPoolId, mapName }) => {
  useEffect(() => {
    const initializeMap = async () => {
      const region = identityPoolId.split(":")[0];
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

      map.addControl(new maplibregl.NavigationControl(), "top-right");
    };
      

    initializeMap();

    return () => {
      // Clean up if needed
    };
  }, [identityPoolId, mapName]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <SolarPanelCalculator />
      <div id="map" style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapV2;
