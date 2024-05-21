import { withIdentityPoolId } from "@aws/amazon-location-utilities-auth-helper";
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Feature, Polygon } from 'geojson';
import maplibregl from 'maplibre-gl';
import React, { useEffect, useRef, useState } from 'react';
// import SolarPanelCalculator from './SolarPanelCalculator';

// Define coordinates array here
let coordinates = [
  [
    [0, 0], // Placeholder coordinates
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0] // closing the polygon to bottom left
  ]
];

interface AdminMapAnalyticsProps {
  identityPoolId: string;
  mapName: string;
}

const AdminMapAnalytics: React.FC<AdminMapAnalyticsProps> = ({ identityPoolId, mapName }) => {
  const [featureCoordinates, setFeatureCoordinates] = useState<number[][] | null>(null);
  const [drawControl, setDrawControl] = useState<MapboxDraw | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [boxSize, setBoxSize] = useState<number>(0.001);  // Initial size of the box in degrees

  const fetchWeatherData = async (points: any[]) => {
    const baseUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&lat=";
    const apiKey = '385df3d81f3a89c1c99c115735540c6d';
    const urls = points.map((point: { lat: string; lng: string; }) => baseUrl + point.lat + "&lon=" + point.lng + "&appid=" + apiKey);

    const weathers = await Promise.all(urls.map(async (url: RequestInfo | URL) => {
      const response = await fetch(url);
      return response.json();
    }));

    return weathers.map((weather, index) => ({
      ...points[index],
      val: weather.main.temp
    }));
  };

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

        mapRef.current.on('load', async () => {
          // Insert the layer beneath any symbol layer.
          mapRef.current?.addSource('openmaptiles', {
            url: `https://api.maptiler.com/tiles/v3/tiles.json?key=UGho1CzUl0HDsQMTTKJ0`,
            type: 'vector',
          });

          mapRef.current?.addLayer(
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
          // Add geolocate control to the map.
          mapRef.current?.addControl(
            new maplibregl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true
              },
              trackUserLocation: true
            }),
            'top-left', // Positioning the control at the top left
          );
          const draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
              point: true, // Enable only point drawing
              // trash: true
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

              mapRef.current?.flyTo({
                center: coordinates,
                zoom: 17, // Set the desired zoom level here
                essential: true // This ensures the transition is not interrupted
              });
            }
          });

          // Create points grid
          const startingLatitude = -80;
          const startingLongitude = -180;
          const endingLatitude = 80;
          const endingLongitude = 180;
          const n = 10;

          const points = [];
          for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
              points.push({
                lat: startingLatitude + i * (endingLatitude - startingLatitude) / n,
                lng: startingLongitude + j * (endingLongitude - startingLongitude) / n,
                val: 0
              });
            }
          }

          console.log('Points:', points); // Debugging

          // Fetch weather data
          const weatherData = await fetchWeatherData(points);

          console.log('Weather Data:', weatherData); // Debugging

          // Add heatmap layer
          const geojson = {
            type: 'FeatureCollection',
            features: weatherData.map(point => ({
              type: 'Feature',
              properties: { temperature: point.val },
              geometry: {
                type: 'Point',
                coordinates: [point.lng, point.lat]
              }
            }))
          };

          console.log('GeoJSON Data:', geojson); // Debugging

          mapRef.current?.addSource('heatmap-source', {
            type: 'geojson',
            data: geojson
          });

          mapRef.current?.addLayer({
            id: 'heatmap-layer',
            type: 'heatmap',
            source: 'heatmap-source',
            paint: {
              'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['get', 'temperature'],
                0, 0,
                30, 1
              ],
              'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 1,
                15, 3
              ],
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(33,102,172,0)',
                0.2, 'rgba(103,169,207,0.5)',
                0.4, 'rgba(209,229,240,0.5)',
                0.6, 'rgba(253,219,199,0.5)',
                0.8, 'rgba(239,138,98,0.5)',
                1, 'rgba(178,24,43,0.5)'
              ],
              'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 2,
                15, 20
              ],
              'heatmap-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7, 0.6,
                15, 0
              ],
            }
          });

          console.log('Heatmap layer added'); // Debugging
        });

        mapRef.current.addControl(new maplibregl.NavigationControl(), "bottom-right");
      } catch (error) {
        setErrorMessage('Failed to initialize the map.');
        console.error(error); // Debugging
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
        if (mapRef.current.getLayer('heatmap-layer')) {
          mapRef.current.removeLayer('heatmap-layer');
          mapRef.current.removeSource('heatmap-source');
        }
        mapRef.current.remove();
      }
    };
  }, [identityPoolId, mapName]); // Effect dependencies

  const drawBoxAroundPoint = (center: number[], size: number = boxSize) => {
    const [lng, lat] = center;
    coordinates = [
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

  const reAddDrawControl = () => {
    if (drawControl && mapRef.current) {
      mapRef.current.addControl(drawControl as any);
    }
  };

  const reAddBoxLayer = () => {
    if (coordinates[0].length && mapRef.current) {
      const geojson: Feature<Polygon> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates
        }
      };

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
  };

  const handleSubmit = () => {
    setIsModalVisible(false);
    // Hide or remove the draw control and any drawn features before capturing the image
    // Temporarily remove the 3D buildings layer
    if (mapRef.current?.getLayer('3d-buildings')) {
      mapRef.current.removeLayer('3d-buildings');
      mapRef.current.removeSource('openmaptiles');
    }

    if (drawControl) {
      mapRef.current?.removeControl(drawControl as any);
    }
    if (mapRef.current?.getLayer('box-layer')) {
      mapRef.current?.removeLayer('box-layer');
      mapRef.current?.removeSource('box-source');
    }

    mapRef.current?.once('render', () => {
      const canvas = mapRef.current?.getCanvas();
      if (!canvas) {
        console.error('Canvas is not available.');
        return;
      }

      // Calculate bounding box in pixel coordinates on the canvas
      const bounds = coordinates[0].map(coord => mapRef.current!.project(new maplibregl.LngLat(coord[0], coord[1])));
      const minX = Math.min(...bounds.map(b => b.x));
      const maxX = Math.max(...bounds.map(b => b.x));
      const minY = Math.min(...bounds.map(b => b.y));
      const maxY = Math.max(...bounds.map(b => b.y));

      // Create a new canvas to draw the cropped image
      const width = maxX - minX;
      const height = maxY - minY;
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = width;
      croppedCanvas.height = height;
      const ctx = croppedCanvas.getContext('2d');

      // Draw the cropped area onto the new canvas
      ctx!.drawImage(canvas, minX, minY, width, height, 0, 0, width, height);
      const dataUrl = croppedCanvas.toDataURL('image/png');

      // Convert the data URL to a Blob and save it
      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      console.log('blob:', blob);
      console.log('mime:', mimeString);

      // Assuming `dataUrl` is your image encoded as a data URL
      fetch(dataUrl)
        .then(res => res.blob())
        .then(blob => {
          const formData = new FormData();
          formData.append('file', blob, 'cropped_map.png');

          // POST request to the server
          fetch(import.meta.env.VITE_API_URL + '/detectionUpload', { // Assuming the endpoint is relative
            method: 'POST',
            body: formData,  // Sending as FormData, not JSON
          })
            .then(response => response.json())
            .then(data => {
              console.log('Success:', data);
            })
            .catch(error => {
              console.error('Error:', error);
            });
        });

      // Optionally re-add removed elements if needed
      reAddDrawControl();
      reAddBoxLayer();
      // Re-add 3D buildings layer if it was previously visible
      if (!mapRef.current?.getLayer('3d-buildings')) {
        // Add 3D buildings layer back to the map
        mapRef.current?.addSource('openmaptiles', {
          url: `https://api.maptiler.com/tiles/v3/tiles.json?key=UGho1CzUl0HDsQMTTKJ0`,
          type: 'vector',
        });
        mapRef.current?.addLayer({
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
        });
      }
    });
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
              <div className="modal-body" style={{ padding: '10px' }}>
                <p>Please confirm if your property is within the drawn box.</p>
                <label>Adjust box size:</label>
                <input
                  type="range"
                  min="0.0005"
                  max="0.005"
                  step="0.0001"
                  value={boxSize}
                  onChange={(e) => {
                    const newSize = parseFloat(e.target.value);
                    setBoxSize(newSize);
                    if (featureCoordinates) {
                      drawBoxAroundPoint(featureCoordinates[0], newSize);
                    }
                  }}
                  style={{ width: '100%' }}
                />
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
        {/* <SolarPanelCalculator /> */}
        <div id="map" style={{ width: '100%', height: '100%' }}>
          {errorMessage && (
            <div style={{ color: 'red', position: 'absolute', top: '10px', left: '10px' }}>{errorMessage}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminMapAnalytics;
