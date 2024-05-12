import React, { useState, useEffect } from 'react';
import exportString from "../api_url";

interface Calculation {
  calculation_id: number;
  number_of_panels: number;
  total_cost: number;
  roi_percentage: number;
  payback_period: number;
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

const LatestCalculation: React.FC = () => {
  const [calculation, setCalculation] = useState<Calculation | null>(null);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = exportString();

  useEffect(() => {
    const fetchLatestCalculation = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/LatestCalc`); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCalculation(data);
        fetchRecommendations(data.total_cost);
      } catch (e) {
        setError('Failed to fetch the latest calculation.');
        console.error(e);
      }
    };

    fetchLatestCalculation();
  }, []);

  const fetchRecommendations = async (totalCost: number) => {
    const level = determineLevelByTotalCost(totalCost);
    try {
      const [consultantResponse, contractorResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/consultants?level=${level}`),
        fetch(`${API_BASE_URL}/contractors?level=${level}`)
      ]);

      if (!consultantResponse.ok || !contractorResponse.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const [consultantsData, contractorsData] = await Promise.all([
        consultantResponse.json(),
        contractorResponse.json()
      ]);

      setConsultants(consultantsData);
      setContractors(contractorsData);
    } catch (e) {
      setError('Failed to fetch recommendations.');
      console.error(e);
    }
  };

  const determineLevelByTotalCost = (totalCost: number): string => {
    if (totalCost > 5000) return 'A';
    if (totalCost > 1000) return 'B';
    return 'C'; // Covers 100-1000 and below, assuming values can't be less than 100 for practical purposes
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!calculation) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Latest Solar Panel Calculation</h1>
      <p><strong>Calculation ID:</strong> {calculation.calculation_id}</p>
      <p><strong>Number of Panels:</strong> {calculation.number_of_panels}</p>
      <p><strong>Total Cost:</strong> {calculation.total_cost} USD</p>
      <p><strong>ROI Percentage:</strong> {calculation.roi_percentage}%</p>
      <p><strong>Payback Period:</strong> {calculation.payback_period} years</p>
      <div>
        <h2>Recommended Consultants</h2>
        <ul>
          {consultants.map(consultant => (
            <li key={consultant.name}>{consultant.name} - {consultant.contact_info} - {consultant.level}</li>
          ))}
        </ul>
        <h2>Recommended Contractors</h2>
        <ul>
          {contractors.map(contractor => (
            <li key={contractor.name}>{contractor.name} - {contractor.contact_info} - {contractor.level}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LatestCalculation;
