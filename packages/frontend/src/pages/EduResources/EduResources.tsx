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

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

interface EducationalResource {
  resource_id: string;
  title: string;
  body: string;
  resource_url: string;
  resource_img: string | null;
  created_at: string; // added created_at attribute
  edited_at: string | null; // added edited_at attribute
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

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

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

  const getCardBackgroundColor = (index: number) => {
    const rowIndex = Math.floor(index / 3);
    switch (rowIndex % 4) {
      case 0:
        return '#FFFF99'; // baby yellow
      case 1:
        return '#87CEEB'; // sky blue
      case 2:
        return '#98FB98'; // light green
      case 3:
        return '#FFA07A'; // baby orange
      default:
        return '#FFFFFF'; // default white
    }
  };

  return (
    <Box sx={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container sx={{ flex: 1, py: 4, pb: 8 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Educational Resources</Typography>
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
                paginatedResources.map((resource, index) => (
                  <Grid key={resource.resource_id} item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        backgroundColor: getCardBackgroundColor(index),
                        padding: 2,
                        borderRadius: 1,
                      }}
                    >
                      {resource.resource_img ? (
                        <img
                          src={`data:image/jpeg;base64,${resource.resource_img}`}
                          alt={resource.title}
                          style={{ height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      ) : (
                        <img
                          src={fallback}
                          alt={resource.title}
                          style={{ height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      )}
                      <Box sx={{ flexGrow: 1, mt: 2 }}>
                        <Typography variant="h6" fontWeight="bold">{resource.title}</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>{resource.body}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Created at: {formatDate(resource.created_at)}
                        </Typography>
                        {resource.edited_at && (
                          <Typography variant="caption" color="textSecondary">
                            Edited at: {formatDate(resource.edited_at)}
                          </Typography>
                        )}
                      </Box>
                      <Stack direction="row" spacing={2} mt={2}>
                        {resource.resource_url && (
                          <Button
                            variant="contained"
                            color="primary"
                            href={resource.resource_url}
                            sx={{ fontSize: '0.75rem' }}
                          >
                            Learn More
                          </Button>
                        )}
                        {isLoggedIn && (
                          <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<Iconify icon="eva:trash-2-outline" />}
                            onClick={() => handleDeleteResource(resource.resource_id)}
                            sx={{ fontSize: '0.75rem' }}
                          >
                            Delete Resource
                          </Button>
                        )}
                      </Stack>
                    </Box>
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
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 1 }}>
            <AddEducationalResource onClose={handleCloseModal} />
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default EducationalResources;
