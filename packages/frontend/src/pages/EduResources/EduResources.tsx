import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import exportString from "../../api_url";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

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
  isLoggedIn: boolean;
}

const EducationalResources: React.FC<EducationalResourcesProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate();
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
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Educational Resources</Typography>

        {isLoggedIn && (
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="error" onClick={() => navigate('/deleteEduResource')}>
              Delete Resource
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate('/addEduResource')}>
              Add Resource
            </Button>
          </Stack>
        )}
      </Stack>

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
        <Grid container spacing={3}>
          {resources.length > 0 ? (
            resources.map((resource) => (
              <Grid key={resource.resource_id} item xs={12} sm={6} md={4}>
                <div className="card h-100">
                  {resource.resource_img && (
                    <img
                      src={`data:image/jpeg;base64,${resource.resource_img}`}
                      alt={resource.title}
                      className="card-img-top"
                    />
                  )}
                  <div className="card-body">
                    <Typography variant="h6">{resource.title}</Typography>
                    <Typography variant="body2">{resource.body}</Typography>
                    {resource.resource_url && <Button href={resource.resource_url} variant="contained" color="primary">Learn More</Button>}
                  </div>
                </div>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" className="text-center">No resources found.</Typography>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default EducationalResources;
