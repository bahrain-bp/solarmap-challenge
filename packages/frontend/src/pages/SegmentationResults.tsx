// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

import { useEffect } from "react";

// interface CalculationResultsPageProps {
//   // imageUrl: string;
// }

// interface CalculationResult {
//   numPanels: number;
//   installationCost: number;
//   electricityCost: number;
//   monthlySavings: number;
//   roiYears: number;
// }

// interface Consultant {
//   name: string;
//   level: string;
//   contact_info: string;
// }

// interface Contractor {
//   name: string;
//   level: string;
//   contact_info: string;
// }

// // const CalculationResultsPage: React.FC<CalculationResultsPageProps> = ({ imageUrl }) => {
// const CalculationResultsPage: React.FC<CalculationResultsPageProps> = () => {
//   const [calculationResults, setCalculationResults] = useState({
//     longitude: 50.5860,
//     latitude: 26.15,
//     numberOfPanels: 10,
//     totalCost: 5000,
//     roiPercentage: 20,
//     paybackPeriod: 5
//   });

//   const [calculation, setCalculation] = useState<CalculationResult | null>(null);
//   const [consultants, setConsultants] = useState<Consultant[]>([]);
//   const [contractors, setContractors] = useState<Contractor[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedResults = sessionStorage.getItem('calculationResults');
//     if (storedResults) {
//       const results = JSON.parse(storedResults);
//       setCalculation(results);
//       fetchRecommendations(results.installationCost);
//     } else {
//       navigate('/');
//     }
//   }, [navigate]);

//   const fetchRecommendations = async (totalCost: number) => {
//     const level = determineLevelByTotalCost(totalCost);
//     try {
//       const consultantResponse = await fetch(`${import.meta.env.VITE_API_URL}/consultants?level=${level}`);
//       const contractorResponse = await fetch(`${import.meta.env.VITE_API_URL}/contractors?level=${level}`);

//       if (!consultantResponse.ok || !contractorResponse.ok) {
//         throw new Error('Failed to fetch data');
//       }

//       const consultantsData = await consultantResponse.json();
//       const contractorsData = await contractorResponse.json();

//       setConsultants(consultantsData);
//       setContractors(contractorsData);
//     } catch (error) {
//       console.error('Error fetching recommendations:', error);
//     }
//   };

//   const determineLevelByTotalCost = (totalCost: number): string => {
//     if (totalCost > 100000) return 'A';
//     if (totalCost > 50000) return 'B';
//     if (totalCost > 25000) return 'C';
//     return 'D';
//   };

//   return (
//     <div className="container mt-4">
//       <h1>Calculation Results</h1>
//       <div className="row">
//         {/* <div className="col-md-12 text-center">
//           <img src={imageUrl} alt="Cropped Map" className="img-fluid" />
//         </div> */}
//       </div>
//       <div className="row mt-4">
//         <div className="col-md-12">
//           <h2>Results</h2>
//           <table className="table table-bordered">
//             <tbody>
//               <tr>
//                 <th>Longitude</th>
//                 <td>{calculationResults.longitude}</td>
//               </tr>
//               <tr>
//                 <th>Latitude</th>
//                 <td>{calculationResults.latitude}</td>
//               </tr>
//               <tr>
//                 <th>Number of Panels</th>
//                 <td>{calculationResults.numberOfPanels}</td>
//               </tr>
//               <tr>
//                 <th>Total Cost</th>
//                 <td>${calculationResults.totalCost}</td>
//               </tr>
//               <tr>
//                 <th>ROI Percentage</th>
//                 <td>{calculationResults.roiPercentage}%</td>
//               </tr>
//               <tr>
//                 <th>Payback Period</th>
//                 <td>{calculationResults.paybackPeriod} years</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//       <h1 className="mb-3">An EWA Representative will contact you in 5-7 business days</h1>
//       {calculation ? (
//         <div className="card">
//           <div className="card-body">
//             <h2 className="card-title">Details</h2>
//             <p>Number of Panels: {calculation.numPanels}</p>
//             <p>Installation Cost: {calculation.installationCost.toFixed(2)} BHD</p>
//             <p>Electricity Cost: {calculation.electricityCost.toFixed(2)} BHD/month</p>
//             <p>Monthly Savings: {calculation.monthlySavings.toFixed(2)} BHD</p>
//             <p>ROI: {calculation.roiYears.toFixed(2)} years</p>
//           </div>
//         </div>
//       ) : (
//         <p>Loading results...</p>
//       )}
//       <div className="mt-4">
//         <h2>Recommended Consultants</h2>
//         <ul className="list-group">
//           {consultants.map(consultant => (
//             <li key={consultant.name} className="list-group-item">
//               {consultant.name} - Level: {consultant.level} - Contact: {consultant.contact_info}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="mt-4">
//         <h2>Recommended Contractors</h2>
//         <ul className="list-group">
//           {contractors.map(contractor => (
//             <li key={contractor.name} className="list-group-item">
//               {contractor.name} - Level: {contractor.level} - Contact: {contractor.contact_info}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default CalculationResultsPage;

export default function CalculationResultsPage() {
  useEffect(() => {
    const webSocketUrl = import.meta.env.VITE_WEB_SOCKET_API_KEY;
    console.log(webSocketUrl);

    const newSocket = new WebSocket(webSocketUrl);

    newSocket.addEventListener("open", (event) => {
      console.log("WebSocket connection opened:", event);
    });

    newSocket.addEventListener("message", (event) => {
      console.log("WebSocket received a message:", event.data);
    });

    newSocket.addEventListener("close", (event) => {
      console.log("WebSocket connection closed:", event);
    });

    newSocket.addEventListener("error", (event) => {
      console.error("WebSocket connection error:", event);
    });

    return () => {
      newSocket.close();
    };
  }, []);
  
  return (    
    <h1> Calculations </h1>
  )
  }
            