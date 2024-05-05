import { useEffect, useState } from 'react';

interface Calculation {
  calculation_id: number;
  number_of_panels: number;
  total_cost: number;
  roi_percentage: number;
  payback_period: number;
}

interface Inquiry {
  inquiry_id: number;
  customer_id: number;
  inquiry_content: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

const Reports = () => {
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch calculations
        const calculationResponse = await fetch(`${import.meta.env.VITE_API_URL}/postcalculation`);
        if (!calculationResponse.ok) {
          throw new Error('Failed to fetch calculations');
        }
        const calculationData = await calculationResponse.json();
        setCalculations(calculationData);

        // Fetch inquiries
        const inquiryResponse = await fetch(`${import.meta.env.VITE_API_URL}/inquiry`);
        if (!inquiryResponse.ok) {
          throw new Error('Failed to fetch inquiries');
        }
        const inquiryData = await inquiryResponse.json();
        setInquiries(inquiryData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  

  return (
    <div className="container">

      {/* Calculations Table */}
      <h2>Calculations</h2>
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

      {/* Inquiries Table */}
      <h2>Inquiries</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Inquiry ID</th>
              <th>Customer ID</th>
              <th>Inquiry Content</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry: Inquiry) => (
              <tr key={inquiry.inquiry_id}>
                <td>{inquiry.inquiry_id}</td>
                <td>{inquiry.customer_id}</td>
                <td>{inquiry.inquiry_content}</td>
                <td>{inquiry.first_name}</td>
                <td>{inquiry.last_name}</td>
                <td>{inquiry.email}</td>
                <td>{inquiry.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reports;
