import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom'; // Ensure proper routing

import gif from '../../assets/SolarGif3.gif'; // Ensure the path is correct

const ErrorPage: React.FC = () => {
  return (
    <Container>
      <Box
        sx={{
          py: 5,  // Reduced padding for a more compact design
          maxWidth: 360,  // Smaller width to make the page look smaller
          mx: 'auto',  // Centers the box
          display: 'flex',
          minHeight: '60vh',  // Reduced minimum height
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>  
          Sorry, page not found!
        </Typography>

        <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}> 
          Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be
          sure to check your spelling.
        </Typography>

        <Box
          component="img"
          src={gif}
          sx={{
            mx: 'auto',
            height: 160,  // Smaller image height
            my: { xs: 3, sm: 5 },  // Smaller margin around the image
          }}
        />

        <Button to="/" size="medium" variant="contained" component={RouterLink} sx={{ mt: 2 }}>  
          Go to Home
        </Button>
      </Box>
    </Container>
  );
}

export default ErrorPage;
