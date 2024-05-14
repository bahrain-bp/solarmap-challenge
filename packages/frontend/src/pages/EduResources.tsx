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
  const navigate = useNavigate();
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    resource_url: '',
    resource_img: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log('Submitting form data:', formData); // Log the data being submitted

    try {
      const response = await fetch(`${API_BASE_URL}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Response:', result); // Log the response

      if (response.ok) {
        setMessage(result.message);
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      console.error('Error submitting form data:', error); // Log any errors
      setMessage('Failed to add resource and send SMS');
    }
  };

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
          <div className="container mt-4">
      <h1 className="display-4">Subscribe to the newsletter!</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            className="form-control"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            className="form-control"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2">Submit</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
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