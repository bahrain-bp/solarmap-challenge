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
