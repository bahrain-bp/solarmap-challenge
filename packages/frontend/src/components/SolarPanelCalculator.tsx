import React, { useState, useEffect } from "react";
import exportString from "../api_url";
import { useNavigate } from "react-router-dom"; 

const SolarPanelCalculator = () => {
  const [rooftopSize, setRooftopSize] = useState<number>(0);
  const [fillPercentage, setFillPercentage] = useState<number>(50);
  const [electricityUsage, setElectricityUsage] = useState<number>(0);
  const [subsidized, setSubsidized] = useState<boolean>(false);
  const [numPanels, setNumPanels] = useState<number>(0);
  const [installationCost, setInstallationCost] = useState<number>(0);
  const [electricityCost, setElectricityCost] = useState<number>(0);
  const [roiYears, setRoiYears] = useState<number>(0);
  const [savingsPerMonth, setSavingsPerMonth] = useState<number>(0);
  const [kmDrivenSaved, setKmDrivenSaved] = useState<number>(0);
  const [emissionsSaved, setEmissionsSaved] = useState<number>(0);
  const [treesPlanted, setTreesPlanted] = useState<number>(0);
  const API_BASE_URL = exportString();
  const [showInquireButton, setShowInquireButton] = useState(false);
  const navigate = useNavigate();
  
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

  const saveSolarPanelCalculation = async (
    numberOfPanels: number,
    totalCost: number,
    roiPercentage: number,
    paybackPeriod: number
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/postcalculation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numberOfPanels,
          totalCost,
          roiPercentage,
          paybackPeriod
        })
      });
      const data = await response.json();
      console.log('Save successful:', data);
    } catch (error) {
      console.error('Error saving solar panel calculation:', error);
    }
  };


  const calculateSolarPanels = () => {
    const actualRooftopSize = (fillPercentage / 100) * rooftopSize;
    const panelsFit = Math.floor(actualRooftopSize / 1.6);
    setNumPanels(panelsFit);
    const installationCost = panelsFit * 500;
    setInstallationCost(installationCost);
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
    const dailyProductionPerPanel = 1.5;
    const daysInMonth = 30;
    const potentialSavings = panelsFit * dailyProductionPerPanel * daysInMonth * costPerKWh;
    const maximumSavings = Math.min(potentialSavings, electricityCost);
    setSavingsPerMonth(maximumSavings);
    const roiMonths = installationCost / maximumSavings;
    const roiYears = roiMonths / 12;
    setRoiYears(roiYears);
    saveSolarPanelCalculation(
      panelsFit,
      installationCost,
      (maximumSavings / installationCost) * 100, // ROI percentage
      roiYears
    );
    calculateCarbonFootprint(maximumSavings);

    setNumPanels(panelsFit);
    setInstallationCost(installationCost);
    setElectricityCost(electricityCost);
    setSavingsPerMonth(potentialSavings);
    setRoiYears(roiYears);

    // Store results in sessionStorage
    sessionStorage.setItem('calculationResults', JSON.stringify({
        numPanels: panelsFit,
        installationCost,
        electricityCost,
        monthlySavings: potentialSavings, 
        roiYears
    }));
    setShowInquireButton(true);
  };

  const handleNextClick = () => {
    // Navigate to CalculationRec page
    navigate('/CalculationRec');
  };

  const calculateCarbonFootprint = (kilowattsSaved: number) => {
    const kmDrivenSaved = kilowattsSaved * 10;
    const emissionsSaved = kilowattsSaved * 0.5;
    const treesPlanted = kilowattsSaved * 0.1;
    setKmDrivenSaved(kmDrivenSaved);
    setEmissionsSaved(emissionsSaved);
    setTreesPlanted(treesPlanted);
  };

  useEffect(() => {
    calculateCarbonFootprint(savingsPerMonth);
  }, [savingsPerMonth]);

  return (
    <div>
      {/* Solar Panel Calculator Overlay */}
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
              {/* Calculate and Inquire buttons side by side */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="form-group">
                  <button type="button" className="btn btn-primary" onClick={calculateSolarPanels}>Calculate</button>
                </div>
                {showInquireButton && (
                  <div className="form-group">
                    <a href="/Inquiry" className="btn btn-success">Inquire</a>
                    <button type="button" className="btn btn-primary" onClick={handleNextClick}>
                      What's Next?
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ROI Overlay */}
      <div style={{ position: 'absolute', top: 0, left: '280px', zIndex: 999, width: '300px', padding: '15px' }}>
        <div className="card">
          <div className="card-body">
            <p>Number of Solar Panels: {numPanels}</p>
            <p>Installation Cost: {installationCost.toFixed(1)} BHD</p>
            <p>Electricity Cost: {electricityCost.toFixed(1)} BHD/month</p>
            <p>Monthly Savings: {savingsPerMonth.toFixed(1)} BHD</p>
            <p>ROI: {roiYears.toFixed(1)} years until break-even</p>
          </div>
        </div>
      </div>

      {/* Carbon Footprint Calculator Overlay */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 999, width: '300px', padding: '15px' }}>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Carbon Footprint Calculator</h5>
            <p>Kilometers Driven Saved: {kmDrivenSaved}</p>
            <p>Emissions Saved (kg): {emissionsSaved}</p>
            <p>Trees Planted: {treesPlanted}</p>
            {/* Add more carbon footprint details here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarPanelCalculator;
