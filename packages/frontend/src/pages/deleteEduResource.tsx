import { useEffect, useState } from 'react';
import exportString from "../api_url";

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

interface EducationalResource {
  resource_id: string;
  title: string;
  resource_url: string;
}

const EducationalResourcesList = () => {
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [selectedResources, setSelectedResources] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/resources`);
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }
        const data = await response.json();
        setResources(data);
        setIsLoading(false);
      } catch (err) {
        setError('Error fetching educational resources');
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleCheckboxChange = (resourceId: string) => {
    setSelectedResources(prevSelected => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(resourceId)) {
        updatedSelected.delete(resourceId);
      } else {
        updatedSelected.add(resourceId);
      }
      return updatedSelected;
    });
  };

  const deleteSelectedResources = async () => {
    const promises = Array.from(selectedResources).map(resourceId =>
      fetch(`${API_BASE_URL}/resources/${resourceId}`, { method: 'DELETE' })
    );

    try {
      await Promise.all(promises);
      const newResources = resources.filter(resource => !selectedResources.has(resource.resource_id));
      setResources(newResources);
      setSelectedResources(new Set()); // Clear selection after deletion
    } catch (error) {
      setError('Failed to delete educational resources');
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
      <h2>Educational Resources</h2>
      <button className="btn btn-danger mb-3" onClick={deleteSelectedResources} disabled={selectedResources.size === 0}>
        Delete Selected
      </button>
      <div className="list-group">
        {resources.map(resource => (
          <div key={resource.resource_id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            {resource.title}
            <input
              type="checkbox"
              checked={selectedResources.has(resource.resource_id)}
              onChange={() => handleCheckboxChange(resource.resource_id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationalResourcesList;
