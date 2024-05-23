import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import * as maptilersdk from '@maptiler/sdk';
import * as maptilerweather from '@maptiler/weather';
import './adminmap.css';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import {Box} from "@mui/material";

const AdminMapAnalytics = () =>
{
  const mapContainer = useRef<HTMLElement | string>('');
  const map = useRef<maplibregl.Map>(null);

  const timeInfoContainer = useRef(null);
  const timeTextDiv = useRef(null);
  const timeSlider = useRef(null);
  const playPauseButton = useRef(null);
  const pointerDataDiv = useRef(null);
  let pointerLngLat: maplibregl.LngLat = null;

  const location = { lng: 50.5860, lat: 26.15 };
  const [zoom] = useState(14);

  maptilersdk.config.apiKey = 'kezi9tzOQF1AmUYRwkVd';

  const layerBg = new maptilerweather.TemperatureLayer({opacity: 0.8});

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

  function playbackSpeed(value: number)
  {
    layer.setAnimationTime(value / 1000)
    layerBg.setAnimationTime(value / 1000)
  }

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    const mapItems = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [location.lng, location.lat],
      zoom: zoom,
    });

    mapItems.on('load', function (){
      mapItems.setPaintProperty("Water", 'fill-color', "rgba(0, 0, 0, 0.6)");
      mapItems.addLayer(layer);
      mapItems.addLayer(layerBg, "Water");
    });

    map.current =  mapItems;

    layer.on("sourceReady", () => {
      const startDate = layer.getAnimationStartDate();
      const endDate = layer.getAnimationEndDate();
      const currentDate = layer.getAnimationTimeDate();
      refreshTime()

      if (timeSlider.current)
      {
        timeSlider.current.min = +startDate;
        timeSlider.current.max = +endDate;
        timeSlider.current.value = +currentDate;
      }
    })

    // Called when the animation is progressing
    layer.on("tick", () => {
      refreshTime();
      updatePointerValue(pointerLngLat);
    })

    // Called when the time is manually set
    layer.on("animationTimeSet", () => {
      refreshTime()
    })

    mapItems.on('mousemove', (e) => {
      updatePointerValue(e.lngLat);
    });

  }, [location.lng, location.lat, zoom]);


  // Update the date time display
  function refreshTime() {
    const d = layer.getAnimationTimeDate();

    if (timeTextDiv.current)
    {
      timeTextDiv.current.innerText = d.toString();
      timeSlider.current.value = +d;
    }
  }

  let isPlaying = false;

  function playPause()
  {
    if (isPlaying) {
      layer.animateByFactor(0);
      layerBg.animateByFactor(0);

      if (playPauseButton.current)
      {playPauseButton.current.innerText = "Play 3600x";}

    } else {
      layer.animateByFactor(3600);
      layerBg.animateByFactor(3600);

      if (playPauseButton.current)
      {
        playPauseButton.current.innerText = "Pause";
      }
    }

    isPlaying = !isPlaying;
  }

  function updatePointerValue(lngLat) {
    if (!lngLat) return;
    pointerLngLat = lngLat;
    const valueWind = layer.pickAt(lngLat.lng, lngLat.lat);
    const valueTemp = layerBg.pickAt(lngLat.lng, lngLat.lat);
    if (!valueWind) {
      pointerDataDiv.current.innerText = "";
      return;
    }
    pointerDataDiv.current.innerText = `${valueTemp.value.toFixed(1)}Â°C \n ${valueWind.speedKilometersPerHour.toFixed(1)} km/h`
  }

  function clearText()
  {
    pointerDataDiv.current.innerText = "";
  }

  return (
      <Box>
        <div id="time-info" ref={timeInfoContainer} onMouseEnter={clearText}>
          <span id="time-text" ref={timeTextDiv}></span>
          <button id="play-pause-bt" className="button" ref={playPauseButton} onClick={playPause}>Play 3600x</button>
          <input type="range" id="time-slider" min="0" max="11" step="1" ref={timeSlider} onChange={(event) => {playbackSpeed(event.target.value)}}/>
        </div>

        <div id="variable-name">Temperature + Wind</div>
        <div id="pointer-data" ref={pointerDataDiv}></div>

        <Box ref={mapContainer} sx={{ height: "100vh", width: "100vw" }}/>
      </Box>
  );
};

export default AdminMapAnalytics;