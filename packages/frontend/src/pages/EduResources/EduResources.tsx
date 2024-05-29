import React, { useEffect, useState } from 'react';
import exportString from '../../api_url';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Iconify from '../../components/iconify';
import fallback from '../../assets/default-fallback-image.png';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AddEducationalResource from './addEduResource';
import EditEducationalResource from './updateEduResource';
import EduRes from '../../assets/Educationalresources.jpg';
import Subscribe from './Subscribe'; // Update the import path as needed

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

interface EducationalResource {
  resource_id: string;
  title: string;
  body: string;
  resource_url: string;
  resource_img: string | null;
  created_at: string; // added created_at attribute
  editted_at: string | null; // added editted_at attribute
}

interface EducationalResourcesProps {
  isLoggedIn: boolean;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
    timeZone: 'Asia/Bahrain'
  };
  return new Date(dateString).toLocaleDateString('en-us', options);
};

const EducationalResources: React.FC<EducationalResourcesProps> = ({ isLoggedIn }) => {
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<EducationalResource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('latest');
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(6);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editResource, setEditResource] = useState<EducationalResource | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false); // New state for refresh trigger

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleOpenEditModal = (resource: EducationalResource) => {
    setEditResource(resource);
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => setEditModalOpen(false);

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

  useEffect(() => {
    fetchResources();
  }, [refreshTrigger]); // Fetch resources on initial render and whenever refreshTrigger changes

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
      case 'latest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
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

  const handleDeleteResource = async (resourceId: string) => {
    if (!isLoggedIn) {
      setSnackbarMessage('You must be logged in to delete a resource');
      setSnackbarOpen(true);
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/resources/${resourceId}`, { method: 'DELETE' });
      setResources(resources.filter(resource => resource.resource_id !== resourceId));
      setFilteredResources(filteredResources.filter(resource => resource.resource_id !== resourceId));
      setSnackbarMessage('Resource deleted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      setError('Failed to delete educational resource');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const paginatedResources = filteredResources.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const cardBackgroundColor = '#073763'; // Same color as the "Learn More" button

  return (
    <Box sx={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ position: 'relative', width: '100%', height: '300px', mb: 4, overflow: 'hidden' }}>
        <img
          src={EduRes}
          alt="Educational Resources"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(70%) blur(3px)',
            marginBottom: '-5px',
            borderRadius: '0'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Educational Resources
          </Typography>
          <Typography variant="h6">
            Explore our comprehensive database of educational materials. Search by topic or type to find your resources.
          </Typography>
        </Box>
      </Box>
      <Subscribe />
      <Container sx={{ flex: 1, py: 4, pb: 8 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          {isLoggedIn && (
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenModal}
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
              sx={{ width: 180 }}
            >
              <MenuItem value="az">A-Z</MenuItem>
              <MenuItem value="za">Z-A</MenuItem>
              <MenuItem value="latest">Latest to Oldest</MenuItem>
              <MenuItem value="oldest">Oldest to Latest</MenuItem>
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

        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography variant="body1" color="error">{error}</Typography>
        ) : filteredResources.length === 0 ? (
          <Typography variant="body1">No resources found.</Typography>
        ) : (
          <Grid container spacing={4}>
            {paginatedResources.map((resource) => (
              <Grid item xs={12} sm={6} md={4} key={resource.resource_id}>
                <Box
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    overflow: 'hidden',
                    backgroundColor: cardBackgroundColor,
                    position: 'relative',
                    height: '100%',
                  }}
                >
                  <a
                    href={resource.resource_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <img
                      src={resource.resource_img || fallback}
                      alt={resource.title}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                      }}
                    />
                  </a>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {resource.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {resource.body.length > 100
                        ? `${resource.body.substring(0, 100)}...`
                        : resource.body}
                    </Typography>
                  </Box>
                  <Box sx={{ px: 2, pb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Created at: {formatDate(resource.created_at)}
                    </Typography>
                    {resource.editted_at && (
                      <Typography variant="body2" color="text.secondary">
                        Edited at: {formatDate(resource.editted_at)}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={2} mt={2}>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: 'black', color: 'white', fontSize: '0.75rem' }}
                        href={resource.resource_url}
                      >
                        Learn More
                      </Button>
                      {isLoggedIn && (
                        <>
                          <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<Iconify icon="eva:trash-2-outline" />}
                            onClick={() => handleDeleteResource(resource.resource_id)}
                            sx={{ fontSize: '0.75rem' }}
                          >
                            Delete Resource
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ 
                              fontSize: '0.75rem',
                              backgroundColor: '#FF8C00', // Darker orange
                              '&:hover': { backgroundColor: '#FF7F00' } // Even darker orange on hover
                            }}
                            startIcon={<Iconify icon="eva:edit-outline" />}
                            onClick={() => handleOpenEditModal(resource)}
                          >
                            Edit Resource
                          </Button>
                        </>
                      )}
                    </Stack>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        <Stack spacing={2} mt={4} alignItems="center">
          <Pagination
            count={Math.ceil(filteredResources.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', maxWidth: 800, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4 }}>
          <AddEducationalResource onClose={() => { handleCloseModal(); setRefreshTrigger(!refreshTrigger); }} />
        </Box>
      </Modal>

      <Modal open={editModalOpen} onClose={handleCloseEditModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', maxWidth: 800, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4 }}>
          {editResource && (
            <EditEducationalResource resource={editResource} onClose={() => { handleCloseEditModal(); setRefreshTrigger(!refreshTrigger); }} />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default EducationalResources;
