import MapboxDraw from '@mapbox/mapbox-gl-draw';
import maplibregl from 'maplibre-gl';
import React, { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import './adminmap.css';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { withIdentityPoolId } from "@aws/amazon-location-utilities-auth-helper";
import * as maptilerweather from '@maptiler/weather';

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
  const [boxSize, setBoxSize] = useState<number>(0.001);
  const timeInfoContainerRef = useRef<HTMLDivElement | null>(null);
  const timeTextDivRef = useRef<HTMLSpanElement | null>(null);
  const timeSliderRef = useRef<HTMLInputElement | null>(null);
  const playPauseButtonRef = useRef<HTMLButtonElement | null>(null);
  const pointerDataDivRef = useRef<HTMLDivElement | null>(null);
  const pointerLngLat = useRef<maplibregl.LngLat | null>(null);

  maptilersdk.config.apiKey = 'kezi9tzOQF1AmUYRwkVd';

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const region = identityPoolId.split(":")[0];
        const authHelper = await withIdentityPoolId(identityPoolId);
  
        let bound = new maplibregl.LngLatBounds(
          new maplibregl.LngLat(50.3, 25.5357),
          new maplibregl.LngLat(50.8120, 26.3870)
        );
  
        mapRef.current = new maptilersdk.Map({
          container: "map",
          center: [50.5860, 26.15],
          zoom: 10,
          maxBounds: bound,
          style: maptilersdk.MapStyle.STREETS,
          ...authHelper.getMapAuthenticationOptions(),
        });
  
        const layerBg = new maptilerweather.TemperatureLayer({
          opacity: 0.8,
        });
  
        const layer = new maptilerweather.WindLayer({
          id: "Wind Particles",
          colorramp: maptilerweather.ColorRamp.builtin.NULL,
          speed: 0.001,
          fadeFactor: 0.03,
          maxAmount: 256,
          density: 200,
          color: [0, 0, 0, 30],
          fastColor: [0, 0, 0, 100],
        });
  
        mapRef.current.on('load', () => {
          const draw = new MapboxDraw({
            displayControlsDefault: false,
          });
          setDrawControl(draw);
          mapRef.current?.addControl(draw as any);
          mapRef.current?.setPaintProperty("Water", 'fill-color', "rgba(0, 0, 0, 0.6)");
          mapRef.current?.addLayer(layer);
          mapRef.current?.addLayer(layerBg, "Water");
        });
  
        if (timeSliderRef.current) {
          timeSliderRef.current.addEventListener("input", (evt) => {
            const timeValue = parseInt(timeSliderRef.current!.value, 10);
            layer.setAnimationTime(timeValue);
            layerBg.setAnimationTime(timeValue);
            refreshTime();
          });
        }
  
        layer.on("sourceReady", event => {
          const startDate = layer.getAnimationStartDate().getTime();
          const endDate = layer.getAnimationEndDate().getTime();
          const currentDate = layer.getAnimationTimeDate().getTime();
          refreshTime();
  
          if (timeSliderRef.current) {
            timeSliderRef.current.min = `${startDate}`;
            timeSliderRef.current.max = `${endDate}`;
            timeSliderRef.current.value = `${currentDate}`;
          }
        });
  
        layer.on("tick", event => {
          refreshTime();
          updatePointerValue(pointerLngLat.current);
        });
  
        layer.on("animationTimeSet", event => {
          refreshTime();
        });
  
        let isPlaying = false;
        if (playPauseButtonRef.current) {
          playPauseButtonRef.current.addEventListener("click", () => {
            if (isPlaying) {
              layer.animateByFactor(0);
              layerBg.animateByFactor(0);
              playPauseButtonRef.current!.innerText = "Play 3600x";
            } else {
              layer.animateByFactor(3600);
              layerBg.animateByFactor(3600);
              playPauseButtonRef.current!.innerText = "Pause";
            }
  
            isPlaying = !isPlaying;
          });
        }
  
        function refreshTime() {
          const d = layer.getAnimationTimeDate();
          if (timeTextDivRef.current && timeSliderRef.current) {
            timeTextDivRef.current.innerText = d.toLocaleString();
            timeSliderRef.current.value = `${d.getTime()}`;
          }
        }
  
        function updatePointerValue(lngLat: maplibregl.LngLat | null) {
          if (!lngLat) return;
          pointerLngLat.current = lngLat;
          const valueWind = layer.pickAt(lngLat.lng, lngLat.lat);
          const valueTemp = layerBg.pickAt(lngLat.lng, lngLat.lat);
          if (!valueWind) {
            if (pointerDataDivRef.current) {
              pointerDataDivRef.current.innerText = "";
            }
            return;
          }
          if (pointerDataDivRef.current) {
            pointerDataDivRef.current.innerText = `${valueTemp.value.toFixed(1)}°C \n ${valueWind.speedKilometersPerHour.toFixed(1)} km/h`;
          }
        }
  
        if (timeInfoContainerRef.current) {
          timeInfoContainerRef.current.addEventListener("mouseenter", () => {
            if (pointerDataDivRef.current) {
              pointerDataDivRef.current.innerText = "";
            }
          });
        }
  
        if (mapRef.current) {
          mapRef.current.on('mousemove', (e) => {
            updatePointerValue(e.lngLat);
          });
        }
  
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
  
  return (
  <>
    {isModalVisible && featureCoordinates && (
      <div className="modal show" role="dialog" style={{ display: 'block', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1050 }}>
        <div className="modal-dialog" role="document" style={{ width: '300px' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Is your property within these bounds?</h5>
              <button type="button" className="close" aria-label="Close" onClick={() => setIsModalVisible(false)}>
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
                }}
                style={{ width: '100%' }}
              />
            </div>
            <div className="modal-footer" style={{ padding: '10px' }}>
              <button type="button" className="btn btn-primary" onClick={() => setIsModalVisible(false)}>Confirm</button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalVisible(false)}>Reset</button>
            </div>
          </div>
        </div>
      </div>
    )}

    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div id="time-info" ref={timeInfoContainerRef}>
        <span id="time-text" ref={timeTextDivRef}></span>
        <button id="play-pause-bt" ref={playPauseButtonRef} className="button">Play 3600x</button>
        <input type="range" id="time-slider" ref={timeSliderRef} min="0" max="11" step="1" />
      </div>

      <div id="variable-name">Temperature + Wind</div>
      <div id="pointer-data" ref={pointerDataDivRef}></div>
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
