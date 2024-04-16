import { useEffect, useState } from 'react';
import exportString from "../api_url";

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

interface EducationalResource {
  resource_id: string;
  title: string;
  body: string;
  resource_url: string;
  resource_img: string | null;  
}

const EducationalResources = () => {
  const [resources, setResources] = useState<EducationalResource[]>([]);
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
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (isLoading) return <div className="text-center"><div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger" role="alert">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Educational Resources</h1>
      {resources.length > 0 ? (
        <div className="row">
          {resources.map((resource) => (
            <div key={resource.resource_id} className="col-md-4 mb-4">
              <div className="card h-100">
                {resource.resource_img && (
                  <img
                    src={`data:image/jpeg;base64,${resource.resource_img}`}
                    alt={resource.title}
                    className="card-img-top"
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{resource.title}</h5>
                  <p className="card-text">{resource.body}</p>
                  {resource.resource_url && <a href={resource.resource_url} className="btn btn-primary">Learn More</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No resources found.</p>
      )}
    </div>
  );
};

export default EducationalResources;
