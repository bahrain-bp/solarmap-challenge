import { withIdentityPoolId } from "@aws/amazon-location-utilities-auth-helper";
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Feature, Polygon } from 'geojson';
import maplibregl from 'maplibre-gl';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// @ts-ignore
MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
// @ts-ignore
MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
// @ts-ignore
MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";

// Define coordinates array here
let coordinates: [number, number][][] = [];

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
  const [boxSize, setBoxSize] = useState<number>(0.001);  // Initial size of the box in degrees
  const navigate = useNavigate();

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

        mapRef.current.getCanvas().className = 'mapboxgl-canvas maplibregl-canvas';
        mapRef.current.getContainer().classList.add('mapboxgl-map');
        const canvasContainer = mapRef.current.getCanvasContainer();
        canvasContainer.classList.add('mapboxgl-canvas-container');
        if (canvasContainer.classList.contains('maplibregl-interactive')) {
          canvasContainer.classList.add('mapboxgl-interactive');
        }

        mapRef.current.on('load', () => {
          mapRef.current?.addSource('openmaptiles', {
            url: `https://api.maptiler.com/tiles/v3/tiles.json?key=UGho1CzUl0HDsQMTTKJ0`,
            type: 'vector',
          });

          mapRef.current?.addControl(
            new maplibregl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true
              },
              trackUserLocation: true
            }),
            'top-left',
          );

          const draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
              point: true,
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
              setIsModalVisible(true);

              mapRef.current?.fitBounds(
                new maplibregl.LngLatBounds(
                  new maplibregl.LngLat(coordinates[0] - boxSize, coordinates[1] - boxSize),
                  new maplibregl.LngLat(coordinates[0] + boxSize, coordinates[1] + boxSize)
                ),
                { padding: 20 }
              );
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
  }, [identityPoolId, mapName]);

  const styleMapControls = () => {
    const buttons = document.querySelectorAll(
      ".mapbox-gl-draw_ctrl-draw-btn, .mapboxgl-ctrl-geolocate, .maplibregl-ctrl-geolocate"
    );
    buttons.forEach((button) => {
      (button as HTMLElement).style.margin = "10px";
      (button as HTMLElement).style.width = "40px";
      (button as HTMLElement).style.height = "40px";
      (button as HTMLElement).style.backgroundColor = "white";
      (button as HTMLElement).style.borderRadius = "2px";
      (button as HTMLElement).style.display = "flex";
      (button as HTMLElement).style.justifyContent = "center";
      (button as HTMLElement).style.alignItems = "center";
    });
  };

  useEffect(() => {
    styleMapControls();

    if (mapRef.current) {
      mapRef.current.on("draw.create", styleMapControls);
    }
  }, [drawControl]);

  const drawBoxAroundPoint = (center: number[], size: number = boxSize) => {
    const [lng, lat] = center;
    coordinates = [
      [
        [lng - size, lat - size],
        [lng + size, lat - size],
        [lng + size, lat + size],
        [lng - size, lat + size],
        [lng - size, lat - size]
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
      styleMapControls();
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

      const bounds = coordinates[0].map(coord => mapRef.current!.project(new maplibregl.LngLat(coord[0], coord[1])));
      const minX = Math.min(...bounds.map(b => b.x));
      const maxX = Math.max(...bounds.map(b => b.x));
      const minY = Math.min(...bounds.map(b => b.y));
      const maxY = Math.max(...bounds.map(b => b.y));

      const width = maxX - minX;
      const height = maxY - minY;
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = width;
      croppedCanvas.height = height;
      const ctx = croppedCanvas.getContext('2d');

      const sx = Math.floor(minX);
      const sy = Math.floor(minY);
      const sWidth = Math.ceil(width);
      const sHeight = Math.ceil(height);

      ctx!.drawImage(canvas, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
      const dataUrl = croppedCanvas.toDataURL('image/png');

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

      fetch(dataUrl)
        .then(res => res.blob())
        .then(blob => {
          const formData = new FormData();
          formData.append('file', blob, 'cropped_map.png');

          fetch(import.meta.env.VITE_API_URL + '/detectionUpload', {
            method: 'POST',
            body: formData,
          })
            .then(response => response.json())
            .then(data => {
              console.log('Success:', data);
              navigate('/SegmentationResults');  // Redirect to home page after success
            })
            .catch(error => {
              console.error('Error:', error);
              navigate('/SegmentationResults');  // Redirect to home page even if there's an error
            });
        });

      reAddDrawControl();
      reAddBoxLayer();
      if (!mapRef.current?.getLayer('3d-buildings')) {
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
          <div className="modal-dialog" role="document" style={{ width: '300px' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Is your property within these bounds?</h5>
                <button type="button" className="close" onClick={handleReset} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" style={{ padding: '10px' }}>
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

export default MapV2;
