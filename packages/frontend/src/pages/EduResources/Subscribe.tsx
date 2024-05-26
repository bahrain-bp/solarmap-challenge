import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '../../components/Typography';
import Button from '../../components/Button';
import SubscribeForm from '../../forms/SubscribeForm'; // Update the import path as needed
import pattern from '../../assets/pattern.png';
import solar from '../../assets/solargetty.png';
import royal from '../../assets/Royal.jpg';

function Subscribe() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        background: `url(${pattern})`, // Use imported pattern as background
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: 8,
      }}
    >
      <Container component="section" sx={{ display: 'flex' }}>
        <Grid container>
          <Grid item xs={12} md={6} sx={{ zIndex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                background: `url(${royal})`, // Use imported royal image as background
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                py: 8,
                px: 3,
                color: 'white', // Set text color to white
              }}
            >
              <Box sx={{ maxWidth: 400 }}>
                <Typography variant="h2" component="h2" gutterBottom sx={{ color: 'white' }}>
                  Subscribe to the Newsletter
                </Typography>
                <Typography variant="h5" sx={{ color: 'white' }}>
                  Get informed and updated whenever a new educational resource is posted!
                </Typography>
                <Button
                  variant="contained"
                  sx={{ 
                    width: '100%', 
                    mt: 3, 
                    mb: 2, 
                    backgroundColor: '#FF8C00', // Darker orange
                    '&:hover': { backgroundColor: '#FF7F00' } // Even darker orange on hover
                  }}
                  onClick={handleOpen}
                >
                  Keep me updated
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: { md: 'block', xs: 'none' }, position: 'relative' }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -67,
                left: -67,
                right: 0,
                bottom: 0,
                width: '100%',
              }}
            />
            <Box
              component="img"
              src={solar} // Use imported solar image
              alt="call to action"
              sx={{
                position: 'absolute',
                top: -28,
                left: -28,
                right: 0,
                bottom: 0,
                width: '100%',
                maxWidth: 600,
              }}
            />
          </Grid>
        </Grid>
        <SubscribeForm open={open} onClose={handleClose} />
      </Container>
    </Box>
  );
}

export default Subscribe;
