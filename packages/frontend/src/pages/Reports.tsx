import { useEffect, useState } from 'react';

interface Calculation {
  calculation_id: number;
  number_of_panels: number;
  total_cost: number;
  roi_percentage: number;
  payback_period: number;
}

const Reports = () => {
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/postcalculation`);
        if (!response.ok) {
          throw new Error('Failed to fetch calculations');
        }
        const data = await response.json();
        setCalculations(data);
      } catch (error) {
        console.error('Error fetching calculations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>Reports</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Calculation ID</th>
              <th>Number of Panels</th>
              <th>Total Cost</th>
              <th>ROI Percentage</th>
              <th>Payback Period</th>
            </tr>
          </thead>
          <tbody>
            {calculations.map((calculation: Calculation) => (
              <tr key={calculation.calculation_id}>
                <td>{calculation.calculation_id}</td>
                <td>{calculation.number_of_panels}</td>
                <td>{calculation.total_cost}</td>
                <td>{calculation.roi_percentage}</td>
                <td>{calculation.payback_period}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reports;
