import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Container,
  Grid,
  Pagination,
  Snackbar,
  Stack,
  Typography,
  CircularProgress,
  TextField,
} from '@mui/material';
import exportString from '../../api_url';
import GroundStation from '../../assets/catagory_satellite_banner.jpg';

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

interface SatelliteDataProps {
  isLoggedIn: boolean;
}

const SatelliteData: React.FC<SatelliteDataProps> = ({ }) => {
  const [satelliteImages, setSatelliteImages] = useState<{ key: string, url: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(6);
  const [searchQuery, setSearchQuery] = useState<string>(''); // New state for search query

  const getFileName = (key: string) => key.replace('data/JPSS1/viirs/level2/', '');

  const extractFileInfo = (fileName: string) => {
    const nameParts = fileName.split('.');
    const dateMatch = fileName.match(/d(\d{8})/);
    const formattedDate = dateMatch ? dateMatch[1].replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : '';
    const firstPart = nameParts[0];
    const lastPart = nameParts[nameParts.length - 2] + '.' + nameParts[nameParts.length - 1];
    return {
      firstPart,
      formattedDate,
      lastPart,
    };
  };

  const fetchSatelliteImages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/satelliteData`);
      if (!response.ok) {
        throw new Error('Failed to fetch satellite images');
      }
      const data = await response.json();
      setSatelliteImages(data.files);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSatelliteImages(); // Fetch satellite images on initial render
  }, []);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setSnackbarMessage(`Page ${value}`);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to the first page on search
  };

  const filteredImages = satelliteImages.filter((image) =>
    getFileName(image.key).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedImages = filteredImages.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const cardBackgroundColor = '#073763'; // Same color as the "Learn More" button

  return (
    <Box sx={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ position: 'relative', width: '100%', height: '300px', mb: 4, overflow: 'hidden' }}>
        <img
          src={GroundStation}
          alt="Satellite Data"
          style={{
            width: '100%',
            height: '150%',
            objectFit: 'cover',
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
            Satellite L2 Data
          </Typography>
          <Typography variant="h6">
            View satellite images retrieved from the Ground Station.
          </Typography>
        </Box>
      </Box>
      <Container sx={{ flex: 1, py: 4, pb: 8 }}>
        <Box mb={4}>
          <TextField
            label="Search Images"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Box>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : filteredImages.length === 0 ? (
          <Typography variant="body1">No images found.</Typography>
        ) : (
          <Grid container spacing={4}>
            {paginatedImages.map((imageData) => {
              const { firstPart, formattedDate, lastPart } = extractFileInfo(getFileName(imageData.key));
              return (
                <Grid item xs={12} sm={6} md={4} key={imageData.key}>
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
                      href={imageData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: 'none',
                        color: 'white',
                      }}
                    >
                      <img
                        src={imageData.url}
                        alt={"Click to Download\n"+imageData.key}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                        }}
                      />
                    </a>
                    <Box sx={{ p: 2 }}>
                      <Typography 
                        variant="body1" 
                        gutterBottom 
                        sx={{ 
                          color: 'white', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden'
                        }}
                      >
                        <strong>Satellite Name:</strong> {firstPart}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        gutterBottom 
                        sx={{ 
                          color: 'white', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden'
                        }}
                      >
                        <strong>Contact Date:</strong> {formattedDate}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        gutterBottom 
                        sx={{ 
                          color: 'white', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden'
                        }}
                      >
                        <strong>Data Type:</strong> {lastPart}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Stack spacing={2} mt={4} alignItems="center">
          <Pagination
            count={Math.ceil(filteredImages.length / rowsPerPage)}
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
    </Box>
  );
};

export default SatelliteData;
