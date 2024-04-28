import { useRef, useState } from 'react';
//import { Application } from '@splinetool/runtime';

interface CarbonFootprintCalculatorProps {}

const CarbonFootprintCalculator: React.FC<CarbonFootprintCalculatorProps> = () => {
    const [electricityUsage, setElectricityUsage] = useState<number>(0);
    const [carMiles, setCarMiles] = useState<number>(0);
    const [wasteAmount, setWasteAmount] = useState<number>(0);
    const [carbonFootprint, setCarbonFootprint] = useState<number>(0);
    const splineRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     if (splineRef.current) {
    //         const canvas = splineRef.current;
    //         const app = new Application(canvas);
    //         app.load('https://prod.spline.design/BRhjjvj4FRf2CRHc/scene.splinecode');
    //     }
    // }, []);

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
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="card shadow" style={{ width: '24rem' }}>
                <div className="card-body">
                    <h2 className="card-title">Carbon Footprint Calculator</h2>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="electricityUsage" className="form-label">
                                Electricity Usage (kWh per month)
                            </label>
                            <div className="input-group">
                                <span className="input-group-text" style={{ backgroundColor: '#0d6efd', color: 'white' }}>
                                    <i className="bi bi-lightning-charge-fill"></i>
                                </span>
                                <input type="number" className="form-control" id="electricityUsage" value={electricityUsage} onChange={handleElectricityChange} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="carMiles" className="form-label">
                                Car Travel (miles per month)
                            </label>
                            <div className="input-group">
                                <span className="input-group-text" style={{ backgroundColor: '#198754', color: 'white' }}>
                                    <i className="bi bi-car-front-fill"></i>
                                </span>
                                <input type="number" className="form-control" id="carMiles" value={carMiles} onChange={handleCarMilesChange} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="wasteAmount" className="form-label">
                                Waste Produced (pounds per week)
                            </label>
                            <div className="input-group">
                                <span className="input-group-text" style={{ backgroundColor: '#ffc107', color: 'black' }}>
                                    <i className="bi bi-trash-fill"></i>
                                </span>
                                <input type="number" className="form-control" id="wasteAmount" value={wasteAmount} onChange={handleWasteChange} />
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={calculateCarbonFootprint}>
                            Calculate Footprint
                        </button>
                    </form>
                    <h5 className="mt-4">Estimated Monthly Carbon Footprint: {carbonFootprint.toFixed(2)} kg CO2</h5>
                </div>
            </div>
            <div ref={splineRef} style={{ flex: '3 1 auto' }} />
        </div>
    );
};

export default CarbonFootprintCalculator;
