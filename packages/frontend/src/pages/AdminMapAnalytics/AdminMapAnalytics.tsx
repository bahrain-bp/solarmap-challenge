import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import * as maptilersdk from '@maptiler/sdk';
import * as maptilerweather from '@maptiler/weather';
import './adminmap.css';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";

const AdminMapAnalytics = () => {

  const mapContainer = useRef<HTMLElement | string>('');
  const timeInfoContainer = useRef<HTMLDivElement | null>(null);
  const timeTextDiv = useRef<HTMLDivElement | null>(null);
  const timeSlider = useRef<HTMLInputElement | null>(null);
  const playPauseButton = useRef<HTMLButtonElement | null>(null);
  const pointerDataDiv = useRef<HTMLDivElement | null>(null);

  const pointerLngLat = useRef<maplibregl.LngLat | null>(null);

  const location = { lng: 50.5860, lat: 26.15 };
  const [zoom] = useState(14);

  const customColoramp = new maptilerweather.ColorRamp({
    stops: [
      { value: 20, color: [254, 224, 144, 255] },
      { value: 25, color: [253, 174, 97, 255] },
      { value: 30, color: [244, 109, 67, 255] },
      { value: 40, color: [215, 48, 39, 255] },
      { value: 55, color: [165, 0, 38, 255] },
    ],
  });

  let bound = new maplibregl.LngLatBounds(
    new maplibregl.LngLat(50.3, 25.5357),
    new maplibregl.LngLat(50.8120, 26.3870)
  );

  maptilersdk.config.apiKey = 'kezi9tzOQF1AmUYRwkVd';

  // Temperature Layer
  const layerBg = new maptilerweather.TemperatureLayer({
    opacity: 0.8,
    colorramp: customColoramp,
  });

  // Wind Layer
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

  function playbackSpeed(value: string) {
    layer.setAnimationTime(parseInt(value) / 1000)
    layerBg.setAnimationTime(parseInt(value) / 1000)
  }

  useEffect(() => {
    if (mapContainer.current === '') return; // stops map from initializing more than once

    const mapItems = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [location.lng, location.lat],
      zoom: zoom,
      maxBounds: bound,
    });

    mapItems.on('load', function () {
      mapItems.setPaintProperty("Water", 'fill-color', "rgba(0, 0, 0, 0.6)");
      mapItems.addLayer(layer as any,);  // Casting to 'any' to bypass type checking
      mapItems.addLayer(layerBg as any, "Water");  // Casting to 'any' to bypass type checking
      mapItems.addControl(new ColorRampLegendControl({ colorRamp: customColoramp }), 'bottom-left');
    });


    class ColorRampLegendControl {
      private _options: { colorRamp: any };
      private _container: HTMLDivElement;
      private _map?: maplibregl.Map;

      constructor(options: { colorRamp: any }) {
        this._options = { ...options };
        this._container = document.createElement("div");
        this._container.classList.add("maplibregl-ctrl");
        this._container.classList.add("maplibregl-ctrl-color-ramp");
      }

      onAdd(map: maplibregl.Map): HTMLDivElement {
        this._map = map;
        const colorRamp = this._options.colorRamp;
        const canvas = colorRamp.getCanvasStrip();
        canvas.style.height = "30px";
        canvas.style.width = "200px";
        canvas.style.border = "1px dashed #00000059";

        const bounds = colorRamp.getBounds();

        const desc = document.createElement("div");
        desc.classList.add("color-ramp-label");
        desc.innerHTML = `(min: ${bounds.min}, max: ${bounds.max})`;

        this._container.appendChild(desc);
        this._container.appendChild(canvas);
        return this._container;
      }

      onRemove(): void {
        if (!this._map || !this._container) {
          return;
        }
        this._container.parentNode?.removeChild(this._container);
        this._map = undefined;
      }
    }

    layer.on("sourceReady", () => {
      const startDate = layer.getAnimationStartDate().getTime();
      const endDate = layer.getAnimationEndDate().getTime();
      const currentDate = layer.getAnimationTimeDate().getTime();
      refreshTime();

      if (timeSlider.current) {
        timeSlider.current.min = `${startDate}`;
        timeSlider.current.max = `${endDate}`;
        timeSlider.current.value = `${currentDate}`;
      }
    });

    layer.on("tick", () => {
      refreshTime();
      updatePointerValue(pointerLngLat.current);
    });

    layer.on("animationTimeSet", () => {
      refreshTime();
    });

    mapItems.on('mousemove', (e) => {
      updatePointerValue(e.lngLat);
    });

  }, [location.lng, location.lat, zoom]);

  function refreshTime() {
    const d = layer.getAnimationTimeDate();

    if (timeTextDiv.current && timeSlider.current) {
      timeTextDiv.current.innerText = d.toString();
      timeSlider.current.value = `${d.getTime()}`;
    }
  }

  let isPlaying = false;

  function playPause() {
    if (isPlaying) {
      layer.animateByFactor(0);
      layerBg.animateByFactor(0);

      if (playPauseButton.current) {
        playPauseButton.current.innerText = "Play 3600x";
      }

    } else {
      layer.animateByFactor(3600);
      layerBg.animateByFactor(3600);

      if (playPauseButton.current) {
        playPauseButton.current.innerText = "Pause";
      }
    }

    isPlaying = !isPlaying;
  }

  function updatePointerValue(lngLat: maplibregl.LngLat | null) {
    if (!lngLat) return;
    pointerLngLat.current = lngLat;
    const valueWind = layer.pickAt(lngLat.lng, lngLat.lat);
    const valueTemp = layerBg.pickAt(lngLat.lng, lngLat.lat);
    if (!valueWind) {
      if (pointerDataDiv.current) {
        pointerDataDiv.current.innerText = "";
      }
      return;
    }

    if (pointerDataDiv.current && valueTemp) {
      pointerDataDiv.current.innerText = `${valueTemp.value.toFixed(1)}°C \n ${valueWind.speedKilometersPerHour.toFixed(1)} km/h`;
    }
  }

  function clearText() {
    if (pointerDataDiv.current) {
      pointerDataDiv.current.innerText = "";
    }
  }

  return (
    <Box sx={{ height: "90vh", width: "100%", position: 'relative' }}>
      {/* Top Left Overlay Division */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1,
          padding: '16px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          borderRadius: '8px',
          '& > *': {
            marginBottom: '8px',
          },
        }}
      >
        <Typography variant="h6">Temperature + Wind</Typography>
        <Typography ref={pointerDataDiv} variant="body1">Overlay Content</Typography>
      </Box>

      <Box ref={mapContainer} sx={{ height: "100%", width: "100%" }} />

      <Box ref={timeInfoContainer} onMouseEnter={clearText}
        sx={{
          display: 'flex',
          position: 'absolute',
          zIndex: 1,
          bottom: 10,
          right: 10,
          flexDirection: 'column',
          justifyContent: 'center',
          mt: 4,
          padding: '20px',
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '8px',
          textShadow: '0px 0px 5px black',
          color: 'white',
        }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <span id="time-text" ref={timeTextDiv} style={{ display: "flex", alignItems: 'center' }}></span>
          <Button sx={{ ml: 1 }} id="play-pause-bt" variant={"contained"} className="button" ref={playPauseButton}
            onClick={playPause}>Play 3600x</Button>
        </Box>

        <input type="range" id="time-slider" min="0" max="11" step="1" ref={timeSlider} onChange={(event) => {
          playbackSpeed(event.target.value)
        }} />
      </Box>
    </Box>
  );
};

export default AdminMapAnalytics;
