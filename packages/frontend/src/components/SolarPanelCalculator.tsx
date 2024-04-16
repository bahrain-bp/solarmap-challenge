import { useState } from "react";

const SolarPanelCalculator: React.FC = () => {
  const [rooftopSize, setRooftopSize] = useState<number>(0);
  const [fillPercentage, setFillPercentage] = useState<number>(50); // Initial fill percentage
  const [electricityUsage, setElectricityUsage] = useState<number>(0);
  const [subsidized, setSubsidized] = useState<boolean>(false);
  const [numPanels, setNumPanels] = useState<number>(0);
  const [installationCost, setInstallationCost] = useState<number>(0);
  const [electricityCost, setElectricityCost] = useState<number>(0);
  const [roiYears, setRoiYears] = useState<number>(0);
  const [savingsPerMonth, setSavingsPerMonth] = useState<number>(0); // New state for savings per month

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
    <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 999, width: '300px', padding: '15px' }}>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Solar Panel Calculator</h5>
          <form>
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
    </div>
  );
};

export default SolarPanelCalculator;
