import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import exportString from '../../api_url';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Iconify from '../../components/iconify';
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
  const [filteredResources, setFilteredResources] = useState<EducationalResource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('az');
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(6);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/resources`);
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }
        const data: EducationalResource[] = await response.json();
        setResources(data);
        setFilteredResources(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    let filtered = resources.filter(resource =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (sortOption) {
      case 'az':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    setFilteredResources(filtered);
  }, [searchQuery, sortOption, resources]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortOption(event.target.value);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const paginatedResources = filteredResources.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

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
        <TextField
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search resources..."
          variant="outlined"
          size="small"
          sx={{ width: 300 }}
        />
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2">Sort by:</Typography>
          <TextField
            select
            value={sortOption}
            onChange={handleSortChange}
            variant="outlined"
            size="small"
            sx={{ width: 150 }}
          >
            <MenuItem value="az">A-Z</MenuItem>
            <MenuItem value="za">Z-A</MenuItem>
          </TextField>
          <Typography variant="body2">Items per page:</Typography>
          <TextField
            select
            value={rowsPerPage.toString()}
            onChange={handleRowsPerPageChange}
            variant="outlined"
            size="small"
            sx={{ width: 100 }}
          >
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={9}>9</MenuItem>
            <MenuItem value={12}>12</MenuItem>
          </TextField>
        </Stack>
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
        <>
          <Grid container spacing={3}>
            {paginatedResources.length > 0 ? (
              paginatedResources.map(resource => (
                <Grid key={resource.resource_id} xs={12} sm={6} md={4}>
                  <div className="card h-100">
                    {resource.resource_img ? (
                      <img
                        src={`data:image/jpeg;base64,${resource.resource_img}`}
                        alt={resource.title}
                        className="card-img-top"
                      />
                    ) : (
                      <img src={fallback} alt={resource.title} className="card-img-top" />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{resource.title}</h5>
                      <p className="card-text">{resource.body}</p>
                      {resource.resource_url && (
                        <a href={resource.resource_url} className="btn btn-primary">
                          Learn More
                        </a>
                      )}
                    </div>
                  </div>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" align="center">
                No resources found.
              </Typography>
            )}
          </Grid>
          <Stack direction="row" justifyContent="center" mt={4}>
            <Pagination
              count={Math.ceil(filteredResources.length / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </>
      )}
    </Container>
  );
};

export default EducationalResources;
