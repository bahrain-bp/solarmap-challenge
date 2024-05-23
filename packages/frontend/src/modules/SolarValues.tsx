import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';
import solarpanelpattern from '../assets/solarpanelpattern.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faBold } from '@fortawesome/free-solid-svg-icons';
import { faCss3Alt } from '@fortawesome/free-brands-svg-icons';

const item: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center', // Center all text
  px: 5,
  py: 3,
  bgcolor: 'rgba(128, 128, 128, 0.9)', // Slightly darker grey background with some opacity
  borderRadius: 1, // Optional: adds a bit of rounding to the corners
  boxShadow: 3, // Optional: adds a slight shadow for better separation
  color: 'white', // Set text color to white
};

function SolarValues() {
  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
        backgroundImage: `url(${solarpanelpattern})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.4)', // Brighter background
      }}
    >
      {/* Dark overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.4)', // Brighter overlay
          zIndex: 1,
        }}
      />
      <Container
        sx={{
          mt: 15,
          mb: 30,
          display: 'flex',
          position: 'relative',
          zIndex: 2, // Ensure content is above the overlay
        }}
      >
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <FontAwesomeIcon icon={faCode} size="3x" />
              <Typography variant="h6" sx={{ my: 5, color: 'white' }}>
                Easy to Use
              </Typography>
              <Typography variant="h5" sx={{ color: 'white' }}>
                A seamless solution for users.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <FontAwesomeIcon icon={faBold} size="3x" />
              <Typography variant="h6" sx={{ my: 5, color: 'white' }}>
                Automated
              </Typography>
              <Typography variant="h5" sx={{ color: 'white' }}>
                A quick and on-the-go experience.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <FontAwesomeIcon icon={faCss3Alt} size="3x" />
              <Typography variant="h6" sx={{ my: 5, color: 'white' }}>
                Customized
              </Typography>
              <Typography variant="h5" sx={{ color: 'white' }}>
                Tailored results for your needs.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default SolarValues;
