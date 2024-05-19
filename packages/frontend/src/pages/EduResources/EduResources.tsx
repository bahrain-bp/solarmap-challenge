import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import exportString from '../../api_url';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Iconify from '../../components/iconify';
import PostCard from './post-card';
import PostSort from './post-sort';
import PostSearch from './post-search';
import fallback from '../../assets/default-fallback-image.png';

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
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => navigate('/addEduResource')}
          >
            New Resource
          </Button>
        )}
      </Stack>

      <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
        <PostSearch posts={resources.map(resource => ({ id: resource.resource_id, title: resource.title }))} />
        <PostSort
          options={[
            { value: 'latest', label: 'Latest' },
            { value: 'popular', label: 'Popular' },
            { value: 'oldest', label: 'Oldest' },
          ]}
          onSort={() => {}} // Add your sorting logic here
        />
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
            resources.map((resource, index) => (
              <PostCard
                key={resource.resource_id}
                post={{
                  id: resource.resource_id,
                  cover: resource.resource_img
                    ? `data:image/jpeg;base64,${resource.resource_img}`
                    : fallback, // Use the imported fallback image path
                  title: resource.title,
                  view: 0,
                  comment: 0,
                  share: 0,
                  author: { name: '', avatarUrl: '' },
                  createdAt: new Date(),
                }}
                index={index}
              />
            ))
          ) : (
            <Typography variant="body1" align="center">
              No resources found.
            </Typography>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default EducationalResources;
