import { useEffect, useState } from 'react';

interface Calculation {
  calculation_id: number;
  number_of_panels: number;
  total_cost: number;
  roi_percentage: number;
  payback_period: number;
}

interface InquiryDetail {
  first_name: string;
  last_name: string;
  email: string;
  phone: number;
  inquiry_content: string;
}

const Reports = () => {
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [inquiryDetails, setInquiryDetails] = useState<InquiryDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCalculations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/postcalculation`);
        if (!response.ok) {
          throw new Error('Failed to fetch calculations');
        }
        const calcData = await response.json();
        setCalculations(calcData);
      } catch (error) {
        console.error('Error fetching calculations:', error);
      }
    };

    const fetchInquiries = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/inquirycustomer`);
        if (!response.ok) {
          throw new Error('Failed to fetch inquiries');
        }
        const inquiryData = await response.json();
        setInquiryDetails(inquiryData);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      }
    };

    Promise.all([fetchCalculations(), fetchInquiries()]).then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="container">
      <h1>Reports</h1>
      {isLoading ? <div>Loading...</div> : (
        <>
          <h2>Calculation Results</h2>
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
              {calculations.map((calculation, index) => (
                <tr key={index}>
                  <td>{calculation.calculation_id}</td>
                  <td>{calculation.number_of_panels}</td>
                  <td>{calculation.total_cost}</td>
                  <td>{calculation.roi_percentage}</td>
                  <td>{calculation.payback_period}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Inquiries with Customer Details</h2>
          <table className="table table-hover">
            <thead className="thead-dark">
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Inquiry</th>
              </tr>
            </thead>
            <tbody>
              {inquiryDetails.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.first_name}</td>
                  <td>{detail.last_name}</td>
                  <td>{detail.email}</td>
                  <td>{detail.phone}</td>
                  <td>{detail.inquiry_content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Reports;
