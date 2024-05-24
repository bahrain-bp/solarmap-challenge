import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import * as maptilersdk from '@maptiler/sdk';
import * as maptilerweather from '@maptiler/weather';
import './adminmap.css';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { Box, Typography, Button } from "@mui/material";
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { fetchWeatherApi } from 'openmeteo';

Chart.register(...registerables);

type WeatherData = {
  hourly: {
    time: Date[];
    shortwaveRadiation: number[];
    diffuseRadiation: number[];
    directNormalIrradiance: number[];
    globalTiltedIrradiance: number[];
    shortwaveRadiationInstant: number[];
    diffuseRadiationInstant: number[];
    directNormalIrradianceInstant: number[];
    globalTiltedIrradianceInstant: number[];
  };
  daily: {
    time: Date[];
    uvIndexMax: number[];
  };
};

const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

const AdminMapAnalytics = () => {
  const mapContainer = useRef<HTMLElement | string>('');
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const timeInfoContainer = useRef<HTMLDivElement | null>(null);
  const timeTextDiv = useRef<HTMLDivElement | null>(null);
  const timeSlider = useRef<HTMLInputElement | null>(null);
  const playPauseButton = useRef<HTMLButtonElement | null>(null);
  const pointerDataDiv = useRef<HTMLDivElement | null>(null);
  const weatherDataDiv = useRef<HTMLDivElement | null>(null);
  const chartBoxRef = useRef<HTMLDivElement | null>(null);

  const pointerLngLat = useRef<maplibregl.LngLat | null>(null);

  const location = { lng: 50.5860, lat: 26.15 };
  const zoom = 10;
  const selectedBuildingId = useRef<string | null>(null);
  const weatherData = useRef<WeatherData | null>(null);
  const showChart = useRef(true);
  const marker = useRef<maplibregl.Marker | null>(null);

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

  const layerBg = new maptilerweather.TemperatureLayer({
    opacity: 0.8,
    colorramp: customColoramp,
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

  function playbackSpeed(value: string) {
    layer.setAnimationTime(parseInt(value) / 1000);
    layerBg.setAnimationTime(parseInt(value) / 1000);
  }

  async function fetchWeatherData(lat: number, lon: number) {
    console.log('Fetching weather data for coordinates:', lat, lon);
    const params = {
      "latitude": lat,
      "longitude": lon,
      "hourly": ["shortwave_radiation", "diffuse_radiation", "direct_normal_irradiance", "global_tilted_irradiance", "shortwave_radiation_instant", "diffuse_radiation_instant", "direct_normal_irradiance_instant", "global_tilted_irradiance_instant"],
      "daily": "uv_index_max"
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    try {
      const responses = await fetchWeatherApi(url, params);
      console.log('Weather data response:', responses);
      const response = responses[0];

      const utcOffsetSeconds = response.utcOffsetSeconds();
      const hourly = response.hourly()!;
      const daily = response.daily()!;

      const weatherDataProcessed = {
        hourly: {
          time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
            (t) => new Date((t + utcOffsetSeconds) * 1000)
          ),
          shortwaveRadiation: Array.from(hourly.variables(0)!.valuesArray()!),
          diffuseRadiation: Array.from(hourly.variables(1)!.valuesArray()!),
          directNormalIrradiance: Array.from(hourly.variables(2)!.valuesArray()!),
          globalTiltedIrradiance: Array.from(hourly.variables(3)!.valuesArray()!),
          shortwaveRadiationInstant: Array.from(hourly.variables(4)!.valuesArray()!),
          diffuseRadiationInstant: Array.from(hourly.variables(5)!.valuesArray()!),
          directNormalIrradianceInstant: Array.from(hourly.variables(6)!.valuesArray()!),
          globalTiltedIrradianceInstant: Array.from(hourly.variables(7)!.valuesArray()!),
        },
        daily: {
          time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
            (t) => new Date((t + utcOffsetSeconds) * 1000)
          ),
          uvIndexMax: Array.from(daily.variables(0)!.valuesArray()!),
        },
      };
      console.log('Processed weather data:', weatherDataProcessed);
      weatherData.current = weatherDataProcessed;
      updateWeatherDisplay();
      updateChart();
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }

  useEffect(() => {
    if (mapContainer.current === '' || mapInstance.current) return;

    const mapItems = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.BACKDROP,
      center: [location.lng, location.lat],
      zoom: zoom,
      maxBounds: bound,
    });

    mapInstance.current = mapItems;

    mapItems.on('load', function () {
      mapItems.setPaintProperty("Water", 'fill-color', "rgba(0, 0, 0, 0.6)");
      mapItems.addLayer(layer as any);  // Casting to 'any' to bypass type checking
      mapItems.addLayer(layerBg as any, "Water");  // Casting to 'any' to bypass type checking
      mapItems.addControl(new ColorRampLegendControl({ colorRamp: customColoramp }), 'top-left');

      // Add 3D buildings layer
      mapItems.addSource('openmaptiles', {
        url: `https://api.maptiler.com/tiles/v3/tiles.json?key=UGho1CzUl0HDsQMTTKJ0`,
        type: 'vector',
      });

      mapItems.addLayer({
        'id': '3d-buildings',
        'source': 'openmaptiles',
        'source-layer': 'building',
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
          'fill-extrusion-color': [
            'case',
            ['==', ['concat', ['get', 'render_height'], '-', ['get', 'render_min_height']], selectedBuildingId.current || ''], // Handle null case
            'yellow', // Color for selected building
            ['interpolate', ['linear'], ['get', 'render_height'], 0, 'lightgray', 200, 'royalblue', 400, 'lightblue']
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

      // Add click event listener for 3D buildings
      mapItems.on('click', '3d-buildings', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const buildingId = `${feature.properties.render_height}-${feature.properties.render_min_height}`;
          console.log('Building clicked:', feature.properties); // Log entire properties object
          selectedBuildingId.current = buildingId;
          updateSelectedBuilding();
        }
      });

      // Change cursor to pointer when hovering over 3d-buildings
      mapItems.on('mouseenter', '3d-buildings', () => {
        mapItems.getCanvas().style.cursor = 'pointer';
      });

      mapItems.on('mouseleave', '3d-buildings', () => {
        mapItems.getCanvas().style.cursor = '';
      });

      // Attach map click listener
      mapItems.on('click', handleMapClick);
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
    });

    layer.on("animationTimeSet", () => {
      refreshTime();
    });

    mapItems.on('mousemove', (e) => {
      updatePointerValue(e.lngLat);
    });

    return () => {
      mapItems.off('click', handleMapClick);
    };

  }, [location.lng, location.lat, zoom]);

  useEffect(() => {
    if (!mapInstance.current) return;

    const mapItems = mapInstance.current;
    console.log('Selected Building ID:', selectedBuildingId.current); // Debug statement

    // Update the fill-extrusion-color when selectedBuildingId changes
    if (mapItems.getLayer('3d-buildings')) {
      mapItems.setPaintProperty('3d-buildings', 'fill-extrusion-color', [
        'case',
        ['==', ['concat', ['get', 'render_height'], '-', ['get', 'render_min_height']], selectedBuildingId.current || ''], // Handle null case
        'yellow', // Color for selected building
        ['interpolate', ['linear'], ['get', 'render_height'], 0, 'lightgray', 200, 'royalblue', 400, 'lightblue']
      ]);
    }

  }, [selectedBuildingId.current]);

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

  async function updatePointerValue(lngLat: maplibregl.LngLat | null) {
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
    if (weatherDataDiv.current) {
      weatherDataDiv.current.innerText = "";
    }
  }

  const getWeatherChartData = () => {
    if (!weatherData.current) return { labels: [], datasets: [] };

    const now = new Date();
    const labels = range(now.getTime(), now.getTime() + 7 * 24 * 60 * 60 * 1000, 24 * 60 * 60 * 1000).map(
      (t: number) => new Date(t).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', hour12: true })
    );

    return {
      labels,
      datasets: [
        {
          label: 'Shortwave Radiation',
          data: weatherData.current.hourly.shortwaveRadiation ?? [],
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
          pointStyle: 'rectRot',
        },
        {
          label: 'Diffuse Radiation',
          data: weatherData.current.hourly.diffuseRadiation ?? [],
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
          pointStyle: 'circle',
        },
        {
          label: 'Direct Normal Irradiance',
          data: weatherData.current.hourly.directNormalIrradiance ?? [],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          pointStyle: 'triangle',
        },
        {
          label: 'Global Tilted Irradiance',
          data: weatherData.current.hourly.globalTiltedIrradiance ?? [],
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          fill: true,
          pointStyle: 'star',
        },
        {
          label: 'Shortwave Radiation Instant',
          data: weatherData.current.hourly.shortwaveRadiationInstant ?? [],
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          fill: true,
          pointStyle: 'rect',
        },
        {
          label: 'Diffuse Radiation Instant',
          data: weatherData.current.hourly.diffuseRadiationInstant ?? [],
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
          pointStyle: 'circle',
        },
        {
          label: 'Direct Normal Irradiance Instant',
          data: weatherData.current.hourly.directNormalIrradianceInstant ?? [],
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
          pointStyle: 'rectRot',
        },
        {
          label: 'Global Tilted Irradiance Instant',
          data: weatherData.current.hourly.globalTiltedIrradianceInstant ?? [],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          pointStyle: 'triangle',
        },
        {
          label: 'UV Index Max',
          data: weatherData.current.daily.uvIndexMax ?? [],
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          fill: true,
          pointStyle: 'line',
          yAxisID: 'y1',
        }
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      y: {
        type: 'linear' as const,
        position: 'left' as const,
        title: {
          display: true,
          text: 'W/m²',
          color: 'white',
        },
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      y1: {
        type: 'linear' as const,
        position: 'right' as const,
        title: {
          display: true,
          text: 'UV Index',
          color: 'white',
        },
        ticks: {
          color: 'white',
        },
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
  };

  const updateWeatherDisplay = () => {
    if (pointerDataDiv.current && weatherData.current) {
      const weatherInfo = weatherData.current.hourly.shortwaveRadiation ? weatherData.current.hourly.shortwaveRadiation[0] : 0;
      pointerDataDiv.current.textContent = `Current Temperature: ${weatherInfo}°C`;
    }
  };

  const updateChart = () => {
    if (chartBoxRef.current) {
      const chartData = getWeatherChartData();
      if (chartBoxRef.current) {
        chartBoxRef.current.innerHTML = '';
        const chartCanvas = document.createElement('canvas');
        chartBoxRef.current.appendChild(chartCanvas);
        new Chart(chartCanvas.getContext('2d')!, {
          type: 'line',
          data: chartData,
          options: chartOptions,
        });
      }
    }
  };

  const toggleChartDisplay = () => {
    showChart.current = !showChart.current;
    const chartBox = chartBoxRef.current;
    if (chartBox) {
      chartBox.style.height = showChart.current ? '60%' : '0';
      chartBox.style.padding = showChart.current ? '16px' : '0';
    }
    if (showChart.current) {
      updateChart();
    }
  };

  function updateSelectedBuilding() {
    if (!mapInstance.current) return;

    const mapItems = mapInstance.current;
    console.log('Selected Building ID:', selectedBuildingId.current); // Debug statement

    // Update the fill-extrusion-color when selectedBuildingId changes
    if (mapItems.getLayer('3d-buildings')) {
      mapItems.setPaintProperty('3d-buildings', 'fill-extrusion-color', [
        'case',
        ['==', ['concat', ['get', 'render_height'], '-', ['get', 'render_min_height']], selectedBuildingId.current || ''], // Handle null case
        'yellow', // Color for selected building
        ['interpolate', ['linear'], ['get', 'render_height'], 0, 'lightgray', 200, 'royalblue', 400, 'lightblue']
      ]);
    }
  }

  function handleMapClick(e: maptilersdk.MapMouseEvent & Object): void {
    fetchWeatherData(e.lngLat.lat, e.lngLat.lng);

    // Remove the previous marker if it exists
    if (marker.current) {
      marker.current.remove();
    }

    // Add a new marker at the clicked location
    marker.current = new maplibregl.Marker()
      .setLngLat(e.lngLat)
      .addTo(mapInstance.current!);

    // Update pointer value with the clicked location
    updatePointerValue(e.lngLat);
  }

  return (
    <Box sx={{ height: "90vh", width: "100%", position: 'relative' }}>
      {/* Top Left Overlay Division */}
      <Box
        sx={{
          position: 'absolute',
          top: 90,
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

      {/* Weather Data Chart Box */}
      <Box
        ref={chartBoxRef}
        sx={{
          position: 'absolute',
          top: '50%',
          right: 10,
          zIndex: 1,
          transform: 'translateY(-50%)',
          width: '50%',
          height: showChart.current ? '60%' : '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '8px',
          padding: showChart.current ? '16px' : '0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          transition: 'height 0.3s, padding 0.3s',
        }}
      >
        {showChart.current && weatherData.current ? (
          <Line data={getWeatherChartData()} options={chartOptions} />
        ) : (
          <Typography variant="body1">No weather data available</Typography>
        )}
      </Box>
      <Button
        sx={{
          position: 'absolute',
          top: '60%',
          right: 'calc(25% + 20px)',
          zIndex: 1,
          transform: 'translateY(-50%)',
        }}
        variant="contained"
        onClick={toggleChartDisplay}
      >
        {showChart.current ? 'Hide Chart' : 'Show Chart'}
      </Button>
    </Box>
  );
};

export default AdminMapAnalytics;
