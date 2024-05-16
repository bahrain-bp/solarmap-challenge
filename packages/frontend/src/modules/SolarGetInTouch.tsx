import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLifeRing } from '@fortawesome/free-solid-svg-icons';

function SolarGetInTouch() {
  return (
    <Container
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        my: 9,
        py: 5,
        borderRadius: 2,
      }}
    >
      <Button
        href="/About"
        sx={{
          border: '4px solid currentColor',
          borderRadius: 0,
          height: 'auto',
          py: 2,
          px: 5,
        }}
      >
        <Typography variant="h4" component="span">
          Got any questions? Need help?
        </Typography>
      </Button>
      <Typography variant="subtitle1" >
        We are here to help. Get in touch!
      </Typography>
      <Box
        sx={{
          width: 60,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
        }}
      >
        <FontAwesomeIcon icon={faLifeRing} size="3x" />
      </Box>
    </Container>
  );
}

export default SolarGetInTouch;
