import { useEffect, useState } from 'react';
import EWABillGraphic from "../assets/website Banners 24Jan2023 En-07.jpg";

const DocumentsDashboard = () => {
  const [ewaBills, setEwaBills] = useState<any[]>([]);
  const [filteredBills, setFilteredBills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubsidised, setFilterSubsidised] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const ewaBillResponse = await fetch(`${import.meta.env.VITE_API_URL}/documents`);
        
        if (!ewaBillResponse.ok) {
          throw new Error('Failed to fetch EWA bills');
        }

        const ewaBillsData = await ewaBillResponse.json();
        setEwaBills(ewaBillsData);
        setFilteredBills(ewaBillsData); // Initially set filtered bills to all bills
      } catch (error) {
        console.error('Error fetching EWA bills data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to filter bills based on search term, subsidy status, and issue date
  useEffect(() => {
    const filtered = ewaBills.filter(bill => {
      const matchesSearchTerm = 
        searchTerm === '' ||
        bill.bill_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.issue_date.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubsidised = 
        filterSubsidised === '' || 
        (bill.subsidised && filterSubsidised === 'Yes') || 
        (!bill.subsidised && filterSubsidised === 'No');
      const matchesDate = 
        filterDate === '' || 
        (bill.issue_date === filterDate);
      return matchesSearchTerm && matchesSubsidised && matchesDate;
    });
    setFilteredBills(filtered);
  }, [ewaBills, searchTerm, filterSubsidised, filterDate]);

  return (
    <>
      <div className="carousel-inner">
        <h1 className="display-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>EWA Bill Documents</h1>
        <p className="lead" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          A comprehensive list of EWA Bills in Bahrain. Search by name or filter to find the relevant document.
        </p>
        <div className="carousel-item active">
          <img className="d-block w-100" alt="Solar Panels" style={{ height: "500px"}} src={EWABillGraphic}/>
          <div className="carousel-caption d-none d-md-block">
          </div>
        </div>
      </div>
    <br />
      <div className="container">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by bill address or issue date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" onClick={() => setSearchTerm('')}>Clear</button>
          </div>
        </div>

        <div className="input-group mb-3">
          <select
            className="form-control"
            value={filterSubsidised}
            onChange={(e) => setFilterSubsidised(e.target.value)}
          >
            <option value="">All Subsidised</option>
            <option value="Yes">Subsidised</option>
            <option value="No">Not Subsidised</option>
          </select>
        </div>

        <div className="input-group mb-3">
          <input
            type="date"
            className="form-control"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="tab-content">
            <div className="tab-pane active">
              <table className="table table-hover">
                <thead className='custom-thead-dark'>
                  <tr>
                    <th scope="col">EWA Bill ID</th>
                    <th scope="col">Issue Date</th>
                    <th scope="col">Electricity Supply</th>
                    <th scope="col">Rate</th>
                    <th scope="col">Usage</th>
                    <th scope="col">Bill Address</th>
                    <th scope="col">Subsidised</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((bill, index) => (
                    <tr key={index}>
                      <td>{bill.bill_id}</td>
                      <td>{bill.issue_date}</td>
                      <td>{bill.electricity_supply} kWh</td>
                      <td>{bill.rate} BD</td>
                      <td>{bill.usage} kWh</td>
                      <td>{bill.bill_address}</td>
                      <td>{bill.subsidised ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentsDashboard;
