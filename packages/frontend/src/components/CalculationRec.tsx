import React, { useState, useEffect } from 'react';
import exportString from "../api_url";

interface Calculation {
  calculation_id: number;
  number_of_panels: number;
  total_cost: number;
  roi_percentage: number;
  payback_period: number;
}

const LatestCalculation: React.FC = () => {
  const [calculation, setCalculation] = useState<Calculation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = exportString();

  useEffect(() => {
    const fetchCalculation = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/LatestCalc`); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCalculation(data);
      } catch (e) {
        setError('Failed to fetch the latest calculation.');
        console.error(e);
      }
    };

    fetchCalculation();
  }, []);

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
      <p><strong>Total Cost:</strong> {calculation.total_cost} BHD</p>
      <p><strong>ROI Percentage:</strong> {calculation.roi_percentage}%</p>
      <p><strong>Payback Period:</strong> {calculation.payback_period} years</p>
    </div>
  );
};

export default LatestCalculation;
