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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import solarprovider from '../../assets/solarprovider.jpg';
import AddConsultant from './addConsultants';
import AddContractor from './addContractor';
import EditConsultant from './editConsultant';
import EditContractor from './editContractor';
import pattern from '../../assets/pattern.png';

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

interface Consultant {
  consultant_id: string;
  name: string;
  level: string;
  crep_num: string;
  contact_info: string;
  fax: number | null;
}

interface Contractor {
  contractor_id: string;
  name: string;
  level: string;
  license_num: string;
  contact_info: string;
  fax: number | null;
}

interface LevelInfo {
  contractors: string;
  consultants: string;
}

const levelsInfo: Record<string, LevelInfo> = {
  '20': {
    contractors: 'D/C/B/A',
    consultants: 'C/A',
  },
  '100': {
    contractors: 'C/B/A',
    consultants: 'C/A',
  },
  '1000': {
    contractors: 'B/A',
    consultants: 'A OR C+B',
  },
  '>1000': {
    contractors: 'A',
    consultants: 'A OR C+B',
  },
};

const LevelDetails = ({ level, details }: { level: string; details: LevelInfo }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="level-detail"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="level-kw">{level} kW</div>
      {isHovered && (
        <div className="level-info">
          <div><strong>Contractors:</strong> {details.contractors}</div>
          <div><strong>Consultants:</strong> {details.consultants}</div>
        </div>
      )}
    </div>
  );
};


const LevelsSection = () => {
  return (
    <div className="levels-section">
      {Object.entries(levelsInfo).map(([level, details]) => (
        <LevelDetails key={level} level={level} details={details} />
      ))}
    </div>
  );
};

interface ProvidersProps {
  isLoggedIn: boolean;
}

const Providers: React.FC<ProvidersProps> = ({ isLoggedIn }) => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [activeTab, setActiveTab] = useState('consultants');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>(''); // 'consultant' or 'contractor'
  const [editProvider, setEditProvider] = useState<Consultant | Contractor | null>(null); // Add editProvider state
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, ] = useState<number>(6);
  const [error, setError] = useState<string | null>(null);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleOpenModal = (type: string) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditProvider(null); // Reset editProvider state on close
  };

  const fetchProviders = async () => {
    setIsLoading(true);
    try {
      const consultantResponse = await fetch(`${API_BASE_URL}/consultants`);
      const contractorResponse = await fetch(`${API_BASE_URL}/contractors`);

      if (!consultantResponse.ok || !contractorResponse.ok) {
        throw new Error('Failed to fetch providers');
      }

      const consultantsData = await consultantResponse.json();
      const contractorsData = await contractorResponse.json();

      setConsultants(consultantsData);
      setContractors(contractorsData);
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [refreshTrigger]);

  useEffect(() => {
    // Reset pagination to page 1 whenever filters change
    setPage(1);
  }, [filterLevel, searchTerm]);

  const filteredConsultants = consultants.filter(consultant => {
    const matchesLevel = filterLevel ? consultant.level === filterLevel : true;
    const matchesSearchTerm = consultant.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearchTerm;
  });

  const filteredContractors = contractors.filter(contractor => {
    const matchesLevel = filterLevel ? contractor.level === filterLevel : true;
    const matchesSearchTerm = contractor.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearchTerm;
  });

  const handleDeleteProvider = async (type: 'consultant' | 'contractor', id: string) => {
    if (!isLoggedIn) {
      setSnackbarMessage('You must be logged in to delete a provider');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${type === 'consultant' ? 'consultants' : 'contractors'}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Failed to delete ${type}`);

      setSnackbarMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
      setSnackbarOpen(true);
      setRefreshTrigger(!refreshTrigger); // Trigger refresh to fetch updated data
    } catch (error) {
      setSnackbarMessage(`Failed to delete ${type}`);
      setSnackbarOpen(true);
    }
  };

  const handleEditProvider = (provider: Consultant | Contractor, type: 'consultant' | 'contractor') => {
    setEditProvider(provider);
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const paginatedConsultants = filteredConsultants.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const paginatedContractors = filteredContractors.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box sx={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ position: 'relative', width: '100%', height: '300px', mb: 4, overflow: 'hidden' }}>
        <img
          src={solarprovider}
          alt="Solar Providers"
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
            Solar PV Consultants and Contractors
          </Typography>
          <Typography variant="h6">
            A comprehensive list of solar PV consultants and contractors in Bahrain. Search by name or filter by level to find your ideal solar energy expert.
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          background: `url(${pattern})`, // Use imported pattern as background
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: 8,
        }}
      >
        <Container>
          <Box sx={{ mb: 4, p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'black' }}>
              Contractors: These are the entities responsible for the installation and construction of solar PV systems. The levels (D, C, B, A) indicate the qualifications and capabilities of the contractors, with A being the highest.
            </Typography>
            <Typography variant="h6" sx={{ mb: 2, color: 'black' }}>
              Consultants: These are the entities responsible for the planning, design, and consultancy services for solar PV systems. The levels (C, A) and combinations (C + B) indicate their qualifications and capabilities, with A being the highest.
            </Typography>
          </Box>
          <LevelsSection />
        </Container>
      </Box>
      <Container sx={{ flex: 1, py: 4, pb: 8 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          {isLoggedIn && (
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => handleOpenModal('consultant')}
            >
              New Consultant
            </Button>
          )}
          {isLoggedIn && (
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => handleOpenModal('contractor')}
            >
              New Contractor
            </Button>
          )}
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <TextField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a provider..."
            variant="outlined"
            size="small"
            sx={{ width: 300 }}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2">Sort by:</Typography>
            <TextField
              select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ width: 180 }}
            >
              <MenuItem value="">All Levels</MenuItem>
              <MenuItem value="A">Level A</MenuItem>
              <MenuItem value="B">Level B</MenuItem>
              <MenuItem value="C">Level C</MenuItem>
              <MenuItem value="D">Level D</MenuItem>
            </TextField>
          </Stack>
        </Stack>

        <Stack direction="row" justifyContent="center" mb={3}>
          <Button
            variant={activeTab === 'consultants' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('consultants')}
          >
            Consultants
          </Button>
          <Button
            variant={activeTab === 'contractors' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('contractors')}
            sx={{ ml: 2 }}
          >
            Contractors
          </Button>
        </Stack>

        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography variant="body1" color="error">{error}</Typography>
        ) : (
          <Grid container spacing={4}>
            {activeTab === 'consultants' && paginatedConsultants.map((consultant, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    overflow: 'hidden',
                    backgroundColor: '#073763',
                    position: 'relative',
                    height: '100%',
                    color: 'white'
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                      {consultant.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'white' }}>
                      Level: {consultant.level}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'white' }}>
                      CRPEP Number: {consultant.crep_num}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'white' }}>
                      Contact Information: {consultant.contact_info}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'white' }}>
                      Fax: {consultant.fax}
                    </Typography>
                  </Box>
                  {isLoggedIn && (
                    <Stack direction="row" spacing={2} mt={2} px={2} pb={2}>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Iconify icon="eva:trash-2-outline" />}
                        onClick={() => handleDeleteProvider('consultant', consultant.consultant_id)}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        Delete Consultant
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Iconify icon="eva:edit-outline" />}
                        onClick={() => handleEditProvider(consultant, 'consultant')}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        Edit Consultant
                      </Button>
                    </Stack>
                  )}
                </Box>
              </Grid>
            ))}
            {activeTab === 'contractors' && paginatedContractors.map((contractor, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    overflow: 'hidden',
                    backgroundColor: '#073763',
                    position: 'relative',
                    height: '100%',
                    color: 'white'
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                      {contractor.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'white' }}>
                      Level: {contractor.level}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'white' }}>
                      License Number: {contractor.license_num}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'white' }}>
                      Contact Information: {contractor.contact_info}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'white' }}>
                      Fax: {contractor.fax}
                    </Typography>
                  </Box>
                  {isLoggedIn && (
                    <Stack direction="row" spacing={2} mt={2} px={2} pb={2}>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Iconify icon="eva:trash-2-outline" />}
                        onClick={() => handleDeleteProvider('contractor', contractor.contractor_id)}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        Delete Contractor
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Iconify icon="eva:edit-outline" />}
                        onClick={() => handleEditProvider(contractor, 'contractor')}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        Edit Contractor
                      </Button>
                    </Stack>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        <Stack spacing={2} mt={4} alignItems="center">
          <Pagination
            count={Math.ceil(
              (activeTab === 'consultants' ? filteredConsultants.length : filteredContractors.length) / rowsPerPage
            )}
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
          {modalType === 'consultant' && !editProvider && (
            <AddConsultant onClose={() => { handleCloseModal(); setRefreshTrigger(!refreshTrigger); }} />
          )}
          {modalType === 'contractor' && !editProvider && (
            <AddContractor onClose={() => { handleCloseModal(); setRefreshTrigger(!refreshTrigger); }} />
          )}
          {modalType === 'consultant' && editProvider && (
            <EditConsultant consultant={editProvider as Consultant} onClose={() => { handleCloseModal(); setRefreshTrigger(!refreshTrigger); }} />
          )}
          {modalType === 'contractor' && editProvider && (
            <EditContractor contractor={editProvider as Contractor} onClose={() => { handleCloseModal(); setRefreshTrigger(!refreshTrigger); }} />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Providers;
