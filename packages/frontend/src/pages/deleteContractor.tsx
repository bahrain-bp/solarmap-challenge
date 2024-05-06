import { useEffect, useState } from 'react';
import exportString from "../api_url";

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

interface Contractor {
  contractor_id: string;
  name: string;
  level: string;
}

const ContractorList = () => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [displayedContractors, setDisplayedContractors] = useState<Contractor[]>([]);
  const [selectedContractors, setSelectedContractors] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/contractors`);
        if (!response.ok) {
          throw new Error('Failed to fetch contractors');
        }
        const data: Contractor[] = await response.json();
        setContractors(data);
        setDisplayedContractors(data);
        setIsLoading(false);
      } catch (err) {
        setError('Error fetching contractors');
        setIsLoading(false);
      }
    };

    fetchContractors();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filteredContractors = contractors.filter(contractor =>
        contractor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDisplayedContractors(filteredContractors);
    } else {
      setDisplayedContractors(contractors);
    }
  }, [searchTerm, contractors]);

  const handleCheckboxChange = (contractorId: string) => {
    setSelectedContractors(prevSelected => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(contractorId)) {
        updatedSelected.delete(contractorId);
      } else {
        updatedSelected.add(contractorId);
      }
      return updatedSelected;
    });
  };

  const deleteSelectedContractors = async () => {
    const promises = Array.from(selectedContractors).map(contractorId =>
      fetch(`${API_BASE_URL}/contractors/${contractorId}`, { method: 'DELETE' })
    );

    try {
      await Promise.all(promises);
      const newContractors = contractors.filter(contractor => !selectedContractors.has(contractor.contractor_id));
      setContractors(newContractors);
      setSelectedContractors(new Set()); // Clear selection after deletion
    } catch (error) {
      setError('Failed to delete contractors');
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
      <h2>Manage Contractors</h2>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search contractors by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="btn btn-danger mb-3" onClick={deleteSelectedContractors} disabled={selectedContractors.size === 0}>
        Delete Selected
      </button>
      <div className="list-group">
        {displayedContractors.map(contractor => (
          <div key={contractor.contractor_id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            {contractor.name} - {contractor.level}
            <input
              type="checkbox"
              checked={selectedContractors.has(contractor.contractor_id)}
              onChange={() => handleCheckboxChange(contractor.contractor_id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractorList;
