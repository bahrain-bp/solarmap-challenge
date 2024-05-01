import { useEffect, useState } from 'react';
import solarprovider from "../assets/solarprovider.jpg";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for button navigation

interface Consultant {
  name: string;
  level: string;
  crep_num: string;
  contact_info: string;
  fax: number | null;
}

interface Contractor {
  name: string;
  level: string;
  license_num: string;
  contact_info: string;
  fax: number | null;
}

interface LevelInfo {
  contractors: string;
  consultants: string;
}

const levelsInfo: Record<string, LevelInfo> = {
  '20': {
    contractors: 'D/C/B/A',
    consultants: 'C/A',
  },
  '100': {
    contractors: 'C/B/A',
    consultants: 'C/A',
  },
  '1000': {
    contractors: 'B/A',
    consultants: 'A OR C+B',
  },
  '>1000': {
    contractors: 'A',
    consultants: 'A OR C+B',
  },
};

const LevelDetails = ({ level, details }: { level: string; details: LevelInfo }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="level-detail"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="level-kw">{level} kW</div>
      {isHovered && (
        <div className="level-info">
          <div><strong>Contractors:</strong> {details.contractors}</div>
          <div><strong>Consultants:</strong> {details.consultants}</div>
        </div>
      )}
    </div>
  );
};


const LevelsSection = () => {
  return (
    <div className="levels-section">
      {Object.entries(levelsInfo).map(([level, details]) => (
        <LevelDetails key={level} level={level} details={details} />
      ))}
    </div>
  );
};

const Providers = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [activeTab, setActiveTab] = useState('consultants');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const consultantResponse = await fetch(`${import.meta.env.VITE_API_URL}/consultants`);
        const contractorResponse = await fetch(`${import.meta.env.VITE_API_URL}/contractors`);
        
        if (!consultantResponse.ok) {
          throw new Error('Failed to fetch consultants');
        }
        if (!contractorResponse.ok) {
          throw new Error('Failed to fetch contractors');
        }

        const consultantsData = await consultantResponse.json();
        const contractorsData = await contractorResponse.json();

        setConsultants(consultantsData);
        setContractors(contractorsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const filteredConsultants = consultants.filter(consultant => {
    const matchesLevel = filterLevel ? consultant.level === filterLevel : true;
    const matchesSearchTerm = consultant.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearchTerm;
  });

  const filteredContractors = contractors.filter(contractor => {
    const matchesLevel = filterLevel ? contractor.level === filterLevel : true;
    const matchesSearchTerm = contractor.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearchTerm;
  });

  return (
    <>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img className="d-block w-100" alt="Solar Panels" style={{ height: "500px"}} src={solarprovider}/>
          <div className="carousel-caption d-none d-md-block">
            <h1 className="display-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>Solar PV Consultants and Contractors</h1>
            <p className="lead" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              A comprehensive list of solar PV consultants and contractors in Bahrain. Search by name or filter by level to find your ideal solar energy expert.
            </p>
          </div>
        </div>
      </div>
      <LevelsSection />
      <div className="card text-center my-4">
        <div className="card-header">
          <strong>Manage Providers</strong>
        </div>
        <div className="card-body">
        <button type="button" className="btn btn-danger mx-2" onClick={() => navigate('/deleteConsultant')}>
            <i className="fas fa-trash-alt"></i> Delete Consultant
          </button>
          <button type="button" className="btn btn-primary mx-2" onClick={() => navigate('/addConsultants')}>
            <i className="fas fa-plus"></i> Add Consultant
          </button>
          <button type="button" className="btn btn-primary mx-2" onClick={() => navigate('/addContractor')}>
            <i className="fas fa-plus"></i> Add Contractor
          </button>
        </div>
      </div>
      <div className="container">
        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            placeholder="Search for a provider..."
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            className="form-control mr-2"
          />
          <select
            onChange={(e) => setFilterLevel(e.target.value)}
            value={filterLevel}
            className="form-control"
          >
            <option value="">All Levels</option>
            <option value="A">Level A</option>
            <option value="B">Level B</option>
            <option value="C">Level C</option>
            <option value="D">Level D</option>
          </select>
        </div>

        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className={`nav-link ${activeTab === 'consultants' ? 'active' : ''}`}
               onClick={() => setActiveTab('consultants')}>Consultants</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${activeTab === 'contractors' ? 'active' : ''}`}
               onClick={() => setActiveTab('contractors')}>Contractors</a>
          </li>
        </ul>

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="tab-content">
            {activeTab === 'consultants' && (
              <div className="tab-pane active">
                <table className="table table-hover">
                  <thead className='custom-thead-dark' >
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Level</th>
                      <th scope="col">CRPEP Number</th>
                      <th scope="col">Contact Information</th>
                      <th scope="col">Fax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConsultants.map((consultant, index) => (
                      <tr key={index}>
                        <td>{consultant.name}</td>
                        <td>{consultant.level}</td>
                        <td>{consultant.crep_num}</td>
                        <td>{consultant.contact_info}</td>
                        <td>{consultant.fax}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'contractors' && (
              <div className="tab-pane active">
                <table className="table table-hover">
                  <thead className='custom-thead-dark'>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Level</th>
                      <th scope="col">License Number</th>
                      <th scope="col">Contact Information</th>
                      <th scope="col">Fax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContractors.map((contractor, index) => (
                      <tr key={index}>
                        <td>{contractor.name}</td>
                        <td>{contractor.level}</td>
                        <td>{contractor.license_num}</td>
                        <td>{contractor.contact_info}</td>
                        <td>{contractor.fax}</td>
                      </tr>
                    ))}
                  </tbody>
                  </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Providers;
