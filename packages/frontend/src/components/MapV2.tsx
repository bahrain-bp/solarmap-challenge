// MapV2.tsx
import React, { useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
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
      const map = new maplibregl.Map({
        container: "map",
        center: [50.5681, 26.1040],
        zoom: 10,
        style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor`,
        ...authHelper.getMapAuthenticationOptions(),
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
