import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface CalculationResult {
    numPanels: number;
    installationCost: number;
    electricityCost: number;
    monthlySavings: number;
    roiYears: number;
}

interface Consultant {
    name: string;
    level: string;
    contact_info: string;
}

interface Contractor {
    name: string;
    level: string;
    contact_info: string;
}

const CalculationRec = () => {
    const [calculation, setCalculation] = useState<CalculationResult | null>(null);
    const [consultants, setConsultants] = useState<Consultant[]>([]);
    const [contractors, setContractors] = useState<Contractor[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedResults = sessionStorage.getItem('calculationResults');
        if (storedResults) {
            const results = JSON.parse(storedResults);
            setCalculation(results);
            fetchRecommendations(results.installationCost);
        } else {
            navigate('/'); 
        }
    }, [navigate]);

    const fetchRecommendations = async (totalCost: number) => {
        const level = determineLevelByTotalCost(totalCost);
        try {
            const consultantResponse = await fetch(`${import.meta.env.VITE_API_URL}/consultants?level=${level}`);
            const contractorResponse = await fetch(`${import.meta.env.VITE_API_URL}/contractors?level=${level}`);

            if (!consultantResponse.ok || !contractorResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const consultantsData = await consultantResponse.json();
            const contractorsData = await contractorResponse.json();

            setConsultants(consultantsData);
            setContractors(contractorsData);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    const determineLevelByTotalCost = (totalCost: number): string => {
        if (totalCost > 5000) return 'A';
        if (totalCost > 1000) return 'B';
        return 'C';
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-3">Calculation Results</h1>
            {calculation ? (
                <div className="card">
                    <div className="card-body">
                        <h2 className="card-title">Details</h2>
                        <p>Number of Panels: {calculation.numPanels}</p>
                        <p>Installation Cost: {calculation.installationCost.toFixed(2)} BHD</p>
                        <p>Electricity Cost: {calculation.electricityCost.toFixed(2)} BHD/month</p>
                        <p>Monthly Savings: {calculation.monthlySavings.toFixed(2)} BHD</p>
                        <p>ROI: {calculation.roiYears.toFixed(2)} years</p>
                    </div>
                </div>
            ) : (
                <p>Loading results...</p>
            )}
            <div className="mt-4">
                <h2>Recommended Consultants</h2>
                <ul className="list-group">
                    {consultants.map(consultant => (
                        <li key={consultant.name} className="list-group-item">
                            {consultant.name} - Level: {consultant.level} - Contact: {consultant.contact_info}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-4">
                <h2>Recommended Contractors</h2>
                <ul className="list-group">
                    {contractors.map(contractor => (
                        <li key={contractor.name} className="list-group-item">
                            {contractor.name} - Level: {contractor.level} - Contact: {contractor.contact_info}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CalculationRec;
