import React, { useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { withIdentityPoolId } from "@aws/amazon-location-utilities-auth-helper";

interface InitializeMapProps {
  identityPoolId: string;
  mapName: string;
}

const InitializeMap: React.FC<InitializeMapProps> = ({ identityPoolId, mapName }) => {
  const [rooftopSize, setRooftopSize] = useState<number>(0);
  const [fillPercentage, setFillPercentage] = useState<number>(50); // Initial fill percentage
  const [electricityUsage, setElectricityUsage] = useState<number>(0);
  const [subsidized, setSubsidized] = useState<boolean>(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [numPanels, setNumPanels] = useState<number>(0);
  const [installationCost, setInstallationCost] = useState<number>(0);
  const [electricityCost, setElectricityCost] = useState<number>(0);
  const [roiYears, setRoiYears] = useState<number>(0);
  const [savingsPerMonth, setSavingsPerMonth] = useState<number>(0); // New state for savings per month

  useEffect(() => {
    const initializeMap = async () => {
      // extract the region from the Identity Pool ID
      const region = identityPoolId.split(":")[0];

      // Create an authentication helper instance using credentials from Cognito
      const authHelper = await withIdentityPoolId(identityPoolId);

      // Initialize the map
      const map = new maplibregl.Map({
        container: "map",
        center: [50.5681, 26.1040],
        zoom: 10,
        style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor`,
        ...authHelper.getMapAuthenticationOptions(),
      });
      map.addControl(new maplibregl.NavigationControl(), "top-right");

      // Set up click listener
      setUpClickListener(map);
    };

    initializeMap();

    // Clean up
    return () => {
      // Do cleanup if needed
    };
  }, [identityPoolId, mapName]);

  // Function to set up click listener
  const setUpClickListener = (map: maplibregl.Map) => {
    // Attach an event listener to map display
    // obtain the coordinates and display in an alert box.
    map.on('click', function (e) {
      const coord = e.lngLat;
      setLatitude(coord.lat);
      setLongitude(coord.lng);
    });
  };

  const handleRooftopSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRooftopSize(parseFloat(event.target.value));
  };

  const handleFillPercentageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFillPercentage(parseFloat(event.target.value));
  };

  const handleElectricityUsageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setElectricityUsage(parseFloat(event.target.value));
  };

  const handleSubsidizedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubsidized(event.target.checked);
  };

  const calculateSolarPanels = () => {
    // Calculate actual rooftop size based on fill percentage
    const actualRooftopSize = (fillPercentage / 100) * rooftopSize;

    // Calculate number of solar panels that will fit
    const panelsFit = Math.floor(actualRooftopSize / 1.6);
    setNumPanels(panelsFit);

    // Calculate installation cost
    const installationCost = panelsFit * 500;
    setInstallationCost(installationCost);

    // Calculate electricity cost
    let costPerKWh = 0;
    if (subsidized) {
      if (electricityUsage <= 3000) {
        costPerKWh = 0.03;
      } else if (electricityUsage <= 5000) {
        costPerKWh = 0.09;
      } else {
        costPerKWh = 0.16;
      }
    } else {
      costPerKWh = 0.29;
    }
    const electricityCost = costPerKWh * electricityUsage;
    setElectricityCost(electricityCost);

    // Calculate monthly savings from solar panels
    const dailyProductionPerPanel = 1.5; // kWh
    const daysInMonth = 30;
    const potentialSavings = panelsFit * dailyProductionPerPanel * daysInMonth * costPerKWh;
    const maximumSavings = Math.min(potentialSavings, electricityCost); // Limit savings to electricity cost
    setSavingsPerMonth(maximumSavings);

    // Calculate ROI in years until break-even
    const roiMonths = installationCost / maximumSavings;
    const roiYears = roiMonths / 12;
    setRoiYears(roiYears);
  };


  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 999, width: '300px', padding: '15px' }}>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Solar Panel Calculator</h5>
            <form>
              <div className="form-group">
                <label htmlFor="latitude">Coordinates (Click on map)</label>
                <input type="text" className="form-control" id="latitude" value={latitude || ''} readOnly />
                <input type="text" className="form-control" id="longitude" value={longitude || ''} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="rooftopSize">Rooftop Size (m²)</label>
                <input type="number" className="form-control" id="rooftopSize" value={rooftopSize} onChange={handleRooftopSizeChange} />
              </div>
              <div className="form-group">
                <label htmlFor="fillPercentage">Percentage of Rooftop to Fill with Solar Panels (%)</label>
                <input type="range" className="form-control-range" id="fillPercentage" value={fillPercentage} onChange={handleFillPercentageChange} />
              </div>
              <div className="form-group">
                <label htmlFor="electricityUsage">Average Electricity Usage (kWh/month)</label>
                <input type="number" className="form-control" id="electricityUsage" value={electricityUsage} onChange={handleElectricityUsageChange} />
              </div>
              <div className="form-group form-check">
                <input type="checkbox" className="form-check-input" id="subsidized" checked={subsidized} onChange={handleSubsidizedChange} />
                <label className="form-check-label" htmlFor="subsidized">Subsidized</label>
              </div>
              <button type="button" className="btn btn-primary" onClick={calculateSolarPanels}>Calculate</button>
            </form>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 0, left: '280px', zIndex: 999, width: '300px', padding: '15px' }}>
        <div className="card">
          <div className="card-body">
            <p>Number of Solar Panels: {numPanels}</p>
            <p>Installation Cost: {installationCost.toFixed(1)} BHD</p>
            <p>Electricity Cost: {electricityCost.toFixed(1)} BHD/month</p>
            <p>Monthly Savings: {savingsPerMonth.toFixed(1)} BHD</p> {/* New line for monthly savings */}
            <p>ROI: {roiYears.toFixed(1)} years until break-even</p>
          </div>
        </div>
      </div>
      <div id="map" style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default InitializeMap;
