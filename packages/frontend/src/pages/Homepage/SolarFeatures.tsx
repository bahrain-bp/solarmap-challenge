import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Container from '@mui/material/Container';
import Typography from '../../components/Typography';
import { Link } from 'react-router-dom';
import map from '../../assets/worldmap.jpg';
import costs from '../../assets/costsavings.jpg';
import energy from '../../assets/energysavings.jpg';
import providers from '../../assets/providers.jpg';
import eduresources from '../../assets/eduresources.jpg';

const ImageBackdrop = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  background: '#000',
  opacity: 0.5,
  transition: theme.transitions.create('opacity'),
}));

const ImageIconButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  display: 'block',
  padding: 0,
  borderRadius: 0,
  height: '40vh',
  width: '100%', // Ensure the width is set correctly for all images
  [theme.breakpoints.down('md')]: {
    width: '100% !important',
    height: 200,  // Increase height for smaller screens
  },
  '&:hover': {
    zIndex: 1,
  },
  '&:hover .imageBackdrop': {
    opacity: 0.15,
  },
  '&:hover .imageMarked': {
    opacity: 0,
  },
  '&:hover .imageTitle': {
    border: '4px solid currentColor',
  },
  '& .imageTitle': {
    position: 'relative',
    padding: `${theme.spacing(2)} ${theme.spacing(4)} 14px`,
    [theme.breakpoints.down('sm')]: {
      padding: `${theme.spacing(1)} ${theme.spacing(2)} 10px`, // Adjust padding for smaller screens
      fontSize: '1rem', // Adjust font size for smaller screens
    },
  },
  '& .imageMarked': {
    height: 3,
    width: 18,
    background: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
}));

const StyledLink = styled(Link)({
  textDecoration: 'none',
  display: 'block',
  boxSizing: 'border-box',
  minWidth: 0,
  flexGrow: 1,
});

const images = [
  {
    url: map,
    title: 'Map',
    link: '/Mapv2',
    width: '100%',
  },
  {
    url: costs,
    title: 'Cost Saving Calculator',
    link: '/Mapv2',
    width: '25%',
  },
  {
    url: energy,
    title: 'Carbon Footprint Calculator',
    link: '/CarbonEmissionsCalculator',
    width: '25%',
  },
  {
    url: providers,
    title: 'Solar Panel Providers',
    link: '/Provider',
    width: '25%',
  },
  {
    url: eduresources,
    title: 'Educational Resources',
    link: '/EducationalResources',
    width: '25%',
  },
];

export default function SolarFeatures() {
  return (
    <Box sx={{ bgcolor: '#0d1b2a', py: 8 }}>
      <Container component="section" sx={{ mt: 8, mb: 4 }}>
        <Typography
          variant="h4"
          marked="center"
          align="center"
          component="h2"
          sx={{ color: 'white', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }} // Adjust font size based on screen size
        >
          What we offer
        </Typography>
        <Box sx={{ mt: 8, display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          {images.map((image) => (
            <StyledLink
              key={image.title}
              to={image.link}
              style={{ width: image.width }} // Apply the width dynamically
            >
              <ImageIconButton>
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    backgroundSize: 'cover',
                    backgroundImage: `url(${image.url})`,
                  }}
                />
                <ImageBackdrop className="imageBackdrop" />
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'common.white',
                  }}
                >
                  <Typography
                    component="h3"
                    variant="h6"
                    color="inherit"
                    className="imageTitle"
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }} // Adjust font size based on screen size
                  >
                    {image.title}
                    <div className="imageMarked" />
                  </Typography>
                </Box>
              </ImageIconButton>
            </StyledLink>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
