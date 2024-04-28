import { useEffect, useRef, useState } from 'react';
import { Application } from '@splinetool/runtime';
import exportString from "../api_url";

interface CarbonFootprintCalculatorProps {}

const CarbonFootprintCalculator: React.FC<CarbonFootprintCalculatorProps> = () => {
    const [electricityUsage, setElectricityUsage] = useState<number>(0);
    const [carMiles, setCarMiles] = useState<number>(0);
    const [wasteAmount, setWasteAmount] = useState<number>(0);
    const [carbonFootprint, setCarbonFootprint] = useState<number>(0);
    const splineCanvasRef = useRef<HTMLCanvasElement>(null);
    const API_BASE_URL = exportString();

    useEffect(() => {
        if (splineCanvasRef.current) {
            const app = new Application(splineCanvasRef.current);
            app.load('https://prod.spline.design/BRhjjvj4FRf2CRHc/scene.splinecode');
        }
    }, []);

    const handleElectricityChange = (event: React.ChangeEvent<HTMLInputElement>) => setElectricityUsage(parseFloat(event.target.value));
    const handleCarMilesChange = (event: React.ChangeEvent<HTMLInputElement>) => setCarMiles(parseFloat(event.target.value));
    const handleWasteChange = (event: React.ChangeEvent<HTMLInputElement>) => setWasteAmount(parseFloat(event.target.value));

    const calculateCarbonFootprint = () => {
        const electricityEF = 0.92; // kg CO2 per kWh
        const carEF = 0.404; // kg CO2 per mile
        const wasteEF = 0.94; // kg CO2 per pound of waste

        const totalEmissions = (electricityUsage * electricityEF) + 
                               (carMiles * carEF) + 
                               ((wasteAmount * 4) * wasteEF); // Convert weekly to monthly
        setCarbonFootprint(totalEmissions);
        saveCarbonFootprint(totalEmissions);
    };

    const saveCarbonFootprint = async (footprint: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/carboncalculator`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ecologicalFootprint: footprint })
            });
            const data = await response.json();
            console.log('Save successful:', data);
        } catch (error) {
            console.error('Error saving carbon footprint:', error);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <canvas ref={splineCanvasRef} style={{ width: '100%', height: '100%' }} />
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '2%',
                transform: 'translateY(-50%)',
                width: '24rem',
                zIndex: 10
            }}>
                <div className="card shadow">
                    <div className="card-body">
                        <h2 className="card-title">Carbon Footprint Calculator</h2>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="electricityUsage" className="form-label">
                                    <i className="bi bi-lightning-charge-fill"></i> Electricity Usage
                                </label>
                                <input type="range" className="form-range" id="electricityUsage" min="0" max="5000" value={electricityUsage} onChange={handleElectricityChange} />
                                <div>{electricityUsage} kWh/month</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="carMiles" className="form-label">
                                    <i className="bi bi-car-front-fill"></i> Car Travel
                                </label>
                                <input type="range" className="form-range" id="carMiles" min="0" max="5000" value={carMiles} onChange={handleCarMilesChange} />
                                <div>{carMiles} miles/month</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="wasteAmount" className="form-label">
                                    <i className="bi bi-trash-fill"></i> Waste Produced
                                </label>
                                <input type="range" className="form-range" id="wasteAmount" min="0" max="100" value={wasteAmount} onChange={handleWasteChange} />
                                <div>{wasteAmount} pounds/week</div>
                            </div>
                            <button type="button" className="btn btn-primary" onClick={calculateCarbonFootprint}>Calculate Footprint</button>
                        </form>
                        <h4 className="text-center mt-4">Estimated Monthly Carbon Footprint: {carbonFootprint.toFixed(2)} kg CO2</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarbonFootprintCalculator;
