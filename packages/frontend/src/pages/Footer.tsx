import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import { Typography, TextField } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';

function Copyright() {
  return (
    <Typography variant="body2" color="white">
      {'© '}
      <Link color="inherit" href="/" sx={{ color: 'white' }}>
        SolarMap
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

const iconStyles = {
  base: {
    width: 48,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    mr: 1,
  },
  facebook: {
    '&:hover': {
      color: '#007BFF', // Blue
    },
  },
  twitter: {
    '&:hover': {
      color: '#FFD700', // Yellow
    },
  },
  instagram: {
    '&:hover': {
      color: '#C13584', // Purple
    },
  },
  youtube: {
    '&:hover': {
      color: '#FF0000', // Red
    },
  },
};

const LANGUAGES = [
  {
    code: 'en-US',
    name: 'English',
  },
  {
    code: 'ar-AR',
    name: 'Arabic',
  },
];

export default function AppFooter() {
  return (
    <Box
      component="footer"
      sx={{ display: 'flex', bgcolor: 'black', color: 'white' }}
    >
      <Container sx={{ my: 8, display: 'flex' }}>
        <Grid container spacing={5}>
          <Grid item xs={6} sm={4} md={3}>
            <Grid
              container
              direction="column"
              justifyContent="flex-end"
              spacing={2}
              sx={{ height: 120 }}
            >
              <Grid item sx={{ display: 'flex' }} >
                <Box component="a" href="https://www.facebook.com/EWA.Bahrain/" sx={{ ...iconStyles.base, ...iconStyles.facebook }} target="_blank">
                  <FacebookIcon />
                </Box>
                <Box component="a" href="https://twitter.com/EWA_Bah" sx={{ ...iconStyles.base, ...iconStyles.twitter }} target="_blank">
                  <FontAwesomeIcon icon={faXTwitter} />
                </Box>
                <Box component="a" href="https://instagram.com/ewa.bahrain?igshid=OGQ5ZDc2ODk2ZA%3D%3D&amp;utm_source=qr" sx={{ ...iconStyles.base, ...iconStyles.instagram }} target="_blank">
                  <InstagramIcon />
                </Box>
                <Box component="a" href="https://www.youtube.com/channel/UCqVMLfnFwkuEoaoJYy-H6ow" sx={{ ...iconStyles.base, ...iconStyles.youtube }} target="_blank">
                  <YouTubeIcon />
                </Box>
              </Grid>
              <Grid item>
                <Copyright />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Legal
            </Typography>
            <hr style={{ borderColor: 'white', marginBottom: '10px' }} />
            <Box component="ul" sx={{ m: 0, listStyle: 'none', p: 0 }}>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link href="/Terms" sx={{ color: 'white', textDecoration: 'underline' }}>Terms</Link>
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link href="/Privacy" sx={{ color: 'white', textDecoration: 'underline' }}>Privacy</Link>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Our Hours
            </Typography>
            <hr style={{ borderColor: 'white', marginBottom: '10px' }} />
            <Box component="ul" sx={{ m: 0, listStyle: 'none', p: 0, color: 'white' }}>
              <Box component="li" sx={{ py: 0.5 }}>
                Monday-Friday: 9am-5pm
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                Saturday: 10am-2pm
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                Sunday: Closed
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Service Governates
            </Typography>
            <hr style={{ borderColor: 'white', marginBottom: '10px' }} />
            <Box component="ul" sx={{ m: 0, listStyle: 'none', p: 0, color: 'white' }}>
              <Box component="li" sx={{ py: 0.5 }}>
                Central Municipal
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                Muharraq Municipal
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                Northern Municipal
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                Southern Municipal
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={8} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Language
            </Typography>
            <TextField
              select
              size="medium"
              variant="standard"
              SelectProps={{
                native: true,
              }}
              sx={{
                mt: 1,
                width: 150,
                color: 'white',
                '.MuiInputBase-root': {
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '.MuiInputLabel-root': {
                  color: 'white',
                },
                '.MuiSelect-icon': {
                  color: 'white',
                },
                '.MuiInput-underline:before': {
                  borderBottomColor: 'white',
                },
                '.MuiInput-underline:after': {
                  borderBottomColor: 'white',
                },
                '.MuiNativeSelect-select': {
                  color: 'white',
                  backgroundColor: 'black',
                },
                '.MuiMenu-paper': {
                  backgroundColor: 'black',
                },
                '.MuiMenuItem-root': {
                  color: 'white',
                },
              }}
            >
              {LANGUAGES.map((language) => (
                <option value={language.code} key={language.code} style={{ backgroundColor: 'black', color: 'white' }}>
                  {language.name}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
