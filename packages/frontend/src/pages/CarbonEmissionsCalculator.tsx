import React, { useEffect, useRef, useState } from 'react';
import { Application } from '@splinetool/runtime';
import exportString from "../api_url";

interface QuestionSlideProps {
    label: string;
    value: number;
    onChange: (newValue: number) => void;
    max: number;
    opacity: number;
}

const QuestionSlide: React.FC<QuestionSlideProps> = ({ label, value, onChange, max, opacity }) => (
    <div className="slide-container" style={{ opacity, transition: 'opacity 0.3s' }}>
        <label htmlFor={label.replace(/\s+/g, '')}>
            {label}
            {label.includes("Electricity") && <i className="bi bi-lightning-fill" style={{marginLeft: '10px'}}></i>}
            {label.includes("Car Travel") && <i className="bi bi-car-front-fill" style={{marginLeft: '10px'}}></i>}
            {label.includes("Waste") && <i className="bi bi-recycle" style={{marginLeft: '10px'}}></i>}
        </label>
        <input
            type="range"
            className="form-range slider"
            id={label.replace(/\s+/g, '')}
            min="0"
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
        />
        <div>{value} {label.split(" ")[1]}</div>
    </div>
);

const StatusAndSuggestions: React.FC<{ footprint: number, status: string, suggestions: string[] }> = ({ footprint, status, suggestions }) => {
    const alertClass = status === 'Good' ? 'alert-success' :
                       status === 'Moderate' ? 'alert-warning' : 'alert-danger';

    return (
        <div>
            <div className={`alert ${alertClass}`} role="alert">
                <h4 className="alert-heading">{status} Carbon Footprint</h4>
                <p>Your carbon footprint is {footprint.toFixed(2)} kg CO2. {status} - here are some suggestions to improve:</p>
            </div>
            <ul className="list-group">
                {suggestions.map((suggestion, index) => (
                    <li key={index} className="list-group-item">{suggestion}</li>
                ))}
            </ul>
        </div>
    );
};

const CarbonFootprintCalculator: React.FC = () => {
    const [step, setStep] = useState(0);
    const [opacity, setOpacity] = useState(1);
    const [electricityUsage, setElectricityUsage] = useState<number>(0);
    const [carMiles, setCarMiles] = useState<number>(0);
    const [wasteAmount, setWasteAmount] = useState<number>(0);
    const [carbonFootprint, setCarbonFootprint] = useState<number | null>(null);
    const [footprintStatus, setFootprintStatus] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const API_BASE_URL = exportString();
    const splineCanvasRef = useRef<HTMLCanvasElement>(null);

    const getFootprintStatusAndSuggestions = (footprint: number): [string, string[]] => {
        let status = '';
        let suggestions: string[] = [];
    
        if (footprint <= 2000) {
            status = 'Good';
            suggestions.push('Maintain your habits!', 'Consider investing in renewable energy sources.');
        } else if (footprint <= 4000) {
            status = 'Moderate';
            suggestions.push('Try reducing your car usage.', 'Consider upgrading to energy-efficient appliances.');
        } else {
            status = 'High';
            suggestions.push('Consider carpooling or using public transportation.', 'Reduce unnecessary electricity usage.', 'Recycle and manage waste efficiently.');
        }
    
        return [status, suggestions];
    };
    
    useEffect(() => {
        if (splineCanvasRef.current) {
            const app = new Application(splineCanvasRef.current);
            app.load('https://prod.spline.design/BRhjjvj4FRf2CRHc/scene.splinecode');
        }
    }, []);

    const questions = [
        {
            label: "Electricity Usage (kWh/month)",
            value: electricityUsage,
            onChange: setElectricityUsage,
            max: 5000
        },
        {
            label: "Car Travel (meters/month)",
            value: carMiles,
            onChange: setCarMiles,
            max: 5000
        },
        {
            label: "Waste Produced (kg/week)",
            value: wasteAmount,
            onChange: setWasteAmount,
            max: 100
        }
    ];

    const handleNext = () => {
        setOpacity(0);  // Set opacity to 0 to fade out the current question
        setTimeout(() => {
            const nextStep = step + 1;
            if (nextStep < questions.length) {
                setStep(nextStep);
            } else {
                calculateCarbonFootprint();
            }
            setOpacity(1);  // Fade in the next question or results
        }, 300);  // Duration matching the CSS transition
    };

    const calculateCarbonFootprint = () => {
        const electricityEF = 0.92; // kg CO2 per kWh
        const carEF = 0.404; // kg CO2 per mile
        const wasteEF = 0.94; // kg CO2 per pound of waste

        const totalEmissions = (electricityUsage * electricityEF) +
                               (carMiles * carEF) +
                               ((wasteAmount * 4) * wasteEF); // Convert weekly to monthly
        setCarbonFootprint(totalEmissions);
        const [status, tips] = getFootprintStatusAndSuggestions(totalEmissions);
        setFootprintStatus(status);
        setSuggestions(tips);
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
            <div className="card shadow" style={{ position: 'absolute', top: '50%', left: '2%', transform: 'translateY(-50%)', width: '24rem', zIndex: 10 }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Carbon Footprint Calculator</h2>
                    {carbonFootprint === null ? (
                        <div>
                            <QuestionSlide
                                label={questions[step].label}
                                value={questions[step].value}
                                onChange={questions[step].onChange}
                                max={questions[step].max}
                                opacity={opacity}
                            />
                            <button className="btn btn-primary" onClick={handleNext}>
                                {step === questions.length - 1 ? 'Calculate' : 'Next'}
                            </button>
                        </div>
                    ) : (
                        <StatusAndSuggestions footprint={carbonFootprint} status={footprintStatus} suggestions={suggestions} />
                    )}
                </div>
            </div>
        </div>
    );
};
export default CarbonFootprintCalculator;
