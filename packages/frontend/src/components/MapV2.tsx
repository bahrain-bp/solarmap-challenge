import React, { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
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

      // Initialize the map
      const map = new maplibregl.Map({
        container: "map",
        center: [-123.115898, 49.295868],
        zoom: 10,
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
