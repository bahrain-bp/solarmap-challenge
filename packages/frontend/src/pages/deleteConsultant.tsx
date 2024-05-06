import { useEffect, useState } from 'react';
import exportString from "../api_url";

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

interface Consultant {
  consultant_id: string;
  name: string;
  level: string;
}

const ConsultantList = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [displayedConsultants, setDisplayedConsultants] = useState<Consultant[]>([]);
  const [selectedConsultants, setSelectedConsultants] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/consultants`);
        if (!response.ok) {
          throw new Error('Failed to fetch consultants');
        }
        const data: Consultant[] = await response.json();
        setConsultants(data);
        setDisplayedConsultants(data);
        setIsLoading(false);
      } catch (err) {
        setError('Error fetching consultants');
        setIsLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filteredConsultants = consultants.filter(consultant =>
        consultant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDisplayedConsultants(filteredConsultants);
    } else {
      setDisplayedConsultants(consultants);
    }
  }, [searchTerm, consultants]);

  const handleCheckboxChange = (consultantId: string) => {
    setSelectedConsultants(prevSelected => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(consultantId)) {
        updatedSelected.delete(consultantId);
      } else {
        updatedSelected.add(consultantId);
      }
      return updatedSelected;
    });
  };

  const deleteSelectedConsultants = async () => {
    const promises = Array.from(selectedConsultants).map(consultantId =>
      fetch(`${API_BASE_URL}/consultants/${consultantId}`, { method: 'DELETE' })
    );

    try {
      await Promise.all(promises);
      const newConsultants = consultants.filter(consultant => !selectedConsultants.has(consultant.consultant_id));
      setConsultants(newConsultants);
      setSelectedConsultants(new Set()); // Clear selection after deletion
    } catch (error) {
      setError('Failed to delete consultants');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="alert alert-danger" role="alert">Error: {error}</p>;
  }

  return (
    <div className="container mt-3">
      <h2>Manage Consultants</h2>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search consultants by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="btn btn-danger mb-3" onClick={deleteSelectedConsultants} disabled={selectedConsultants.size === 0}>
        Delete Selected
      </button>
      <div className="list-group">
        {displayedConsultants.map(consultant => (
          <div key={consultant.consultant_id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            {consultant.name} - {consultant.level}
            <input
              type="checkbox"
              checked={selectedConsultants.has(consultant.consultant_id)}
              onChange={() => handleCheckboxChange(consultant.consultant_id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsultantList;
