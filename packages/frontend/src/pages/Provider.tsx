import { useEffect, useState } from 'react';
import axios from 'axios';
import solarprovider from "../assets/solarprovider.jpg";

const API_BASE_URL = "https://un8sm6ux9g.execute-api.us-east-1.amazonaws.com";

interface Consultant {
  name: string;
  level: string;
  crep_num: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchConsultants = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/consultants`);
        setConsultants(response.data);
      } catch (error) {
        console.error('Error fetching consultants:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultants();
  }, [searchTerm, filterLevel]);

  const filteredConsultants = consultants.filter(consultant => {
    const matchesLevel = filterLevel ? consultant.level === filterLevel : true;
    const matchesSearchTerm = consultant.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearchTerm;
  });

  return (
    <div className="container-fluid">
      <div  className="jumbotron jumbotron-fluid" style={{ backgroundImage: `url(${solarprovider})` }}>
        <div className="container">
          <h1 className="display-4">Solar PV Consultants and Contractors</h1>
          <p className="lead">
            A comprehensive list of solar PV consultants and contractors in Bahrain. Search by name or filter by level to find your ideal solar energy expert.
          </p>
        </div>
      </div>
      
      <LevelsSection />
      
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

        {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
        ) : (
          <table className="table">
            <thead className="custom-thead-dark">
              <tr>
                <th>Name</th>
                <th>Level</th>
                <th>CRPEP Number</th>
                <th>Contact Information</th>
                <th>Fax</th>
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
        )}
      </div>
    </div>
  );
};

export default Providers;
