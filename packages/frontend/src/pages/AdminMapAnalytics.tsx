import { withIdentityPoolId } from "@aws/amazon-location-utilities-auth-helper";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Feature, Polygon } from 'geojson';
import maplibregl from 'maplibre-gl';
import React, { useEffect, useRef, useState } from 'react';

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

interface AdminMapAnalytics {
  identityPoolId: string;
  mapName: string;
}

const AdminMapAnalytics: React.FC<AdminMapAnalytics> = ({ identityPoolId, mapName }) => {
  const [featureCoordinates, setFeatureCoordinates] = useState<number[][] | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isHeatmapVisible, setIsHeatmapVisible] = useState<boolean>(true);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [boxSize, setBoxSize] = useState<number>(0.001);  // Initial size of the box in degrees

  // Placeholder for your API key
  const weatherApiKey = '7e88d5867ab30cdbeebb0e81c523d89c';

  const fetchWeatherData = async (): Promise<GeoJSON.FeatureCollection<GeoJSON.Point>> => {
    // Define the bounds of your area of interest
    const bounds = {
      north: 26.3870,
      south: 25.5357,
      west: 50.3,
      east: 50.8120
    };

    // Fetch weather data from the API (example uses OpenWeatherMap)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/box/city?bbox=${bounds.west},${bounds.south},${bounds.east},${bounds.north},10&appid=${weatherApiKey}`);
    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }
    const data = await response.json();

    // Process data to create a GeoJSON feature collection
    const features = data.list.map((city: any) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [city.coord.Lon, city.coord.Lat]
      },
      properties: {
        temperature: city.main.temp // Use temperature as the property for heatmap
      }
    }));

    return {
      type: 'FeatureCollection',
      features
    };
  };

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const region = identityPoolId.split(":")[0];
        const authHelper = await withIdentityPoolId(identityPoolId);

        mapRef.current = new maplibregl.Map({
          container: "map",
          center: [50.5860, 26.15],
          zoom: 10,
          style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor`,
          ...authHelper.getMapAuthenticationOptions(),
        });

        mapRef.current.on('load', async () => {
          if (mapRef.current) {
            // Hide all existing layers to ensure the heatmap is visible
            const layers = mapRef.current.getStyle().layers;
            if (layers) {
              for (const layer of layers) {
                mapRef.current.setLayoutProperty(layer.id, 'visibility', 'none');
              }
            }

            // Fetch weather data and add heatmap source and layer
            const weatherData = await fetchWeatherData();
            if (!mapRef.current.getSource('heatmap-source')) {
              mapRef.current.addSource('heatmap-source', {
                type: 'geojson',
                data: weatherData
              });
            }

            if (!mapRef.current.getLayer('heatmap-layer')) {
              mapRef.current.addLayer({
                id: 'heatmap-layer',
                type: 'heatmap',
                source: 'heatmap-source',
                paint: {
                  // Increase the heatmap weight based on temperature
                  'heatmap-weight': [
                    'interpolate',
                    ['linear'],
                    ['get', 'temperature'],
                    0, 0,
                    40, 1
                  ],
                  // Increase the heatmap color weight by zoom level
                  'heatmap-intensity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0, 1,
                    9, 3
                  ],
                  // Color ramp for heatmap. Domain is 0 (low) to 1 (high).
                  'heatmap-color': [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0, 'rgba(33,102,172,0)',
                    0.2, 'rgb(103,169,207)',
                    0.4, 'rgb(209,229,240)',
                    0.6, 'rgb(253,219,199)',
                    0.8, 'rgb(239,138,98)',
                    1, 'rgb(178,24,43)'
                  ],
                  // Adjust the heatmap radius by zoom level
                  'heatmap-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0, 2,
                    9, 20
                  ],
                  // Transition from heatmap to circle layer by zoom level
                  'heatmap-opacity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7, 1,
                    9, 0
                  ],
                }
              });
            }
          }
        });

        mapRef.current.addControl(new maplibregl.NavigationControl(), "bottom-right");
      } catch (error) {
        setErrorMessage(`Failed to initialize the map: ${error}`);
      }
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
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

  const handleToggleHeatmap = () => {
    if (mapRef.current) {
      if (isHeatmapVisible) {
        mapRef.current.setLayoutProperty('heatmap-layer', 'visibility', 'none');
      } else {
        mapRef.current.setLayoutProperty('heatmap-layer', 'visibility', 'visible');
      }
      setIsHeatmapVisible(!isHeatmapVisible);
    }
  };

  const handleSubmit = () => {
    setIsModalVisible(false);
    // Hide or remove the draw control and any drawn features before capturing the image
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

      // Save the Blob locally
      // const link = document.createElement('a');
      // link.href = window.URL.createObjectURL(blob);
      // link.download = 'cropped_map.png'; // Update the file name
      // link.click();

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
    });
  };

  const handleReset = () => {
    if (mapRef.current?.getLayer('box-layer')) {
      mapRef.current?.removeLayer('box-layer');
      mapRef.current?.removeSource('box-source');
    }
    setFeatureCoordinates(null);
    setIsModalVisible(false);
  };

  return (
    <>
      <button onClick={handleToggleHeatmap} style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1050 }}>
        {isHeatmapVisible ? 'Hide' : 'Show'} Heatmap
      </button>

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
