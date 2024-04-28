import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { withIdentityPoolId } from "@aws/amazon-location-utilities-auth-helper";
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Feature, Polygon } from 'geojson';
import SolarPanelCalculator from './SolarPanelCalculator';

interface MapV2Props {
  identityPoolId: string;
  mapName: string;
}

const MapV2: React.FC<MapV2Props> = ({ identityPoolId, mapName }) => {
  const [featureCoordinates, setFeatureCoordinates] = useState<number[][] | null>(null);
  const [drawControl, setDrawControl] = useState<MapboxDraw | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const mapRef = useRef<maplibregl.Map | null>(null);


  useEffect(() => {
    const initializeMap = async () => {
      try {
        const region = identityPoolId.split(":")[0];
        const authHelper = await withIdentityPoolId(identityPoolId);

        let bound = new maplibregl.LngLatBounds(
          new maplibregl.LngLat(50.3, 25.5357),
          new maplibregl.LngLat(50.8120, 26.3870)
        );

        mapRef.current = new maplibregl.Map({
          container: "map",
          center: [50.5860, 26.15],
          zoom: 10,
          maxBounds: bound,
          style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor`,
          ...authHelper.getMapAuthenticationOptions(),
        });

        mapRef.current.on('load', () => {
          const draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
              point: true, // Enable only point drawing
              trash: true
            }
          });

          setDrawControl(draw);
          mapRef.current?.addControl(draw as any);

          mapRef.current?.on('draw.create', (event) => {
            const feature = event.features[0];
            if (feature.geometry.type === 'Point') {
              const coordinates = feature.geometry.coordinates;
              setFeatureCoordinates([coordinates]);
              drawBoxAroundPoint(coordinates);
              setIsModalVisible(true); // Show modal after drawing the box
            }
          });
        });

        mapRef.current.addControl(new maplibregl.NavigationControl(), "bottom-right");
      } catch (error) {
        setErrorMessage('Failed to initialize the map.');
      }
    };

    initializeMap();

    return () => {
      if (drawControl) {
        drawControl.deleteAll();
      }
      if (mapRef.current) {
        if (mapRef.current.getLayer('box-layer')) {
          mapRef.current.removeLayer('box-layer');
          mapRef.current.removeSource('box-source');
        }
        mapRef.current.remove();
      }
    };
  }, [identityPoolId, mapName]); // Effect dependencies

  const drawBoxAroundPoint = (center: number[], size = 0.001) => {
    const [lng, lat] = center;
    const coordinates = [
      [
        [lng - size, lat - size], // bottom left
        [lng + size, lat - size], // bottom right
        [lng + size, lat + size], // top right
        [lng - size, lat + size], // top left
        [lng - size, lat - size]  // closing the polygon to bottom left
      ]
    ];

    const geojson: Feature<Polygon> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: coordinates
      }
    };

    if (mapRef.current) {
      const source = mapRef.current.getSource('box-source') as maplibregl.GeoJSONSource;
      if (source) {
        source.setData(geojson);
      } else {
        mapRef.current.addSource('box-source', {
          type: 'geojson',
          data: geojson
        });
        mapRef.current.addLayer({
          id: 'box-layer',
          type: 'fill',
          source: 'box-source',
          layout: {},
          paint: {
            'fill-color': 'green',
            'fill-opacity': 0.4
          }
        });
      }
    }
  };

  const handleSubmit = () => {
    setIsModalVisible(false);
    console.log(featureCoordinates);
  };

  const handleReset = () => {
    if (drawControl) {
      drawControl.deleteAll();
    }
    if (mapRef.current) {
      if (mapRef.current.getLayer('box-layer')) {
        mapRef.current.removeLayer('box-layer');
        mapRef.current.removeSource('box-source');
      }
    }
    setFeatureCoordinates(null);
    setIsModalVisible(false);
  };

  return (
    <>
      {isModalVisible && featureCoordinates && (
        <div className="modal show" role="dialog" style={{ display: 'block', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1050 }}>
          <div className="modal-dialog" role="document" style={{ width: '300px' }}> {/* Smaller width */}
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Is your property within these bounds?</h5>
                <button type="button" className="close" onClick={handleReset} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" style={{ padding: '10px' }}> {/* Reduced padding */}
                <p>Please confirm if your property is within the drawn box.</p>
              </div>
              <div className="modal-footer" style={{ padding: '10px' }}>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Confirm</button>
                <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <SolarPanelCalculator />
        <div id="map" style={{ width: '100%', height: '100%' }}>
          {errorMessage && (
            <div style={{ color: 'red', position: 'absolute', top: '10px', left: '10px' }}>{errorMessage}</div>
          )}
        </div>
      </div>
    </>
  );
  
};    

export default MapV2;
