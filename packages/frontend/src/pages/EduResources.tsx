import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import exportString from "../api_url";
import EduRes from "../assets/Educationalresources.jpg";

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

interface EducationalResource {
  resource_id: string;
  title: string;
  body: string;
  resource_url: string;
  resource_img: string | null;
}

interface EducationalResourcesProps {
  isLoggedIn: boolean;  // Added prop to determine if the user is logged in
}

const EducationalResources: React.FC<EducationalResourcesProps> = ({ isLoggedIn }) => {  // Destructure isLoggedIn from props
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/resources`);
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }
        const data: EducationalResource[] = await response.json();
        setResources(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img className="d-block w-100" alt="Educational Resources" style={{ height: "500px" }} src={EduRes}/>
          <div className="carousel-caption d-none d-md-block">
            <h1 className="display-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>Educational Resources</h1>
            <p className="lead" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              Explore our comprehensive database of educational materials. Search by topic or type to find your resources.
            </p>
          </div>
        </div>
      </div>
      {isLoggedIn && (
        <div className="card text-center my-4">
          <div className="card-header">
            <strong>Manage Resources</strong>
          </div>
          <div className="card-body">
            <button type="button" className="btn btn-danger mx-2" onClick={() => navigate('/deleteEduResource')}>
              <i className="fas fa-trash-alt"></i> Delete Resource
            </button>
            <button type="button" className="btn btn-primary mx-2" onClick={() => navigate('/addEduResource')}>
              <i className="fas fa-plus"></i> Add Resource
            </button>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      )}
      {!isLoading && !error && (
        <div className="container mt-4">
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
      )}
    </>
  );
};

export default EducationalResources;