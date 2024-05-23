import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import * as maptilersdk from '@maptiler/sdk';
import * as maptilerweather from '@maptiler/weather';
import './adminmap.css';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import {Box, Typography} from "@mui/material";
import Button from "@mui/material/Button";

const AdminMapAnalytics = () =>
{

  const mapContainer = useRef<HTMLElement | string>('');

  const timeInfoContainer = useRef<HTMLDivElement | null>(null);
  const timeTextDiv = useRef<HTMLDivElement | null>(null);
  const timeSlider = useRef<HTMLInputElement | null>(null);
  const playPauseButton = useRef<HTMLButtonElement | null>(null);
  const pointerDataDiv = useRef<HTMLDivElement | null>(null);

  const pointerLngLat = useRef<maplibregl.LngLat | null>(null);

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

  function playbackSpeed(value: string)
  {
    layer.setAnimationTime(parseInt(value) / 1000)
    layerBg.setAnimationTime(parseInt(value) / 1000)
  }

  useEffect(() => {
    if (mapContainer.current === '') return; // stops map from intializing more than once

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

    layer.on("sourceReady", () => {
      const startDate = layer.getAnimationStartDate().getTime();
      const endDate = layer.getAnimationEndDate().getTime();
      const currentDate = layer.getAnimationTimeDate().getTime();
      refreshTime()

      if (timeSlider.current)
      {
        timeSlider.current.min = `${startDate}`;
        timeSlider.current.max = `${endDate}`;
        timeSlider.current.value = `${currentDate}`;
      }
    })

    // Called when the animation is progressing
    layer.on("tick", () => {
      refreshTime();
      updatePointerValue(pointerLngLat.current);
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

    if (timeTextDiv.current && timeSlider.current)
    {
      timeTextDiv.current.innerText = d.toString();
      timeSlider.current.value = `${d.getTime()}`;
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

  function updatePointerValue(lngLat: maplibregl.LngLat | null) {
    if (!lngLat) return;
    pointerLngLat.current = lngLat;
    const valueWind = layer.pickAt(lngLat.lng, lngLat.lat);
    const valueTemp = layerBg.pickAt(lngLat.lng, lngLat.lat);
    if (!valueWind) {
      if (pointerDataDiv.current)
      {
        pointerDataDiv.current.innerText = "";
      }
      return;
    }

    if (pointerDataDiv.current && valueTemp)
    {
      pointerDataDiv.current.innerText = `${valueTemp.value.toFixed(1)}Â°C \n ${valueWind.speedKilometersPerHour.toFixed(1)} km/h`
    }
  }

  function clearText()
  {
    if (pointerDataDiv.current)
    {
      pointerDataDiv.current.innerText = "";
    }
  }

  return (
      <Box sx={{height: "90vh", width: "100%", position: 'relative'}}>
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

        <Box ref={mapContainer} sx={{ height: "80%", width: "100%" }}/>

        <Box ref={timeInfoContainer} onMouseEnter={clearText}
             sx={{
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'center',
               mt: 4,
               padding: '20px',
               background: 'rgba(0, 0, 0, 0.5)', /* Added background to improve visibility */
               borderRadius: '8px',
               textShadow: '0px 0px 5px black',
               color: 'white',
             }}>
          <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <span id="time-text" ref={timeTextDiv} style={{display: "flex", alignItems: 'center'}}></span>
            <Button sx={{ml: 1}} id="play-pause-bt" variant={"contained"} className="button" ref={playPauseButton}
                    onClick={playPause}>Play 3600x</Button>
          </Box>

          <input type="range" id="time-slider" min="0" max="11" step="1" ref={timeSlider} onChange={(event) => {
            playbackSpeed(event.target.value)
          }}/>
        </Box>
      </Box>
  );
};

export default AdminMapAnalytics;