import { useState } from 'react';
import { Box, Button, Container, Grid, Link, Typography, TextField } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import SubscribeForm from '../forms/SubscribeForm';
import UnsubscribeForm from '../forms/UnsubscribeForm';

const LANGUAGES = [
  { code: 'en-US', name: 'English' },
  { code: 'ar-AR', name: 'Arabic' },
];

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
  facebook: { '&:hover': { color: '#007BFF' } },
  twitter: { '&:hover': { color: '#FFD700' } },
  instagram: { '&:hover': { color: '#C13584' } },
  youtube: { '&:hover': { color: '#FF0000' } },
};

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


export default function AppFooter() {
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [unsubscribeOpen, setUnsubscribeOpen] = useState(false);

  const handleSubscribeOpen = () => setSubscribeOpen(true);
  const handleSubscribeClose = () => setSubscribeOpen(false);
  const handleUnsubscribeOpen = () => setUnsubscribeOpen(true);
  const handleUnsubscribeClose = () => setUnsubscribeOpen(false);

  return (
    <Box component="footer" sx={{ display: 'flex', bgcolor: 'black', color: 'white' }}>
      <Container maxWidth="xl" sx={{ my: 4 }}>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={3}>
            <Grid container direction="column" spacing={1}>
              <Grid item sx={{ display: 'flex' }}>
                <Link href="https://www.facebook.com/EWA.Bahrain/" sx={{ ...iconStyles.base, ...iconStyles.facebook }} target="_blank">
                  <FacebookIcon />
                </Link>
                <Link href="https://twitter.com/EWA_Bah" sx={{ ...iconStyles.base, ...iconStyles.twitter }} target="_blank">
                  <FontAwesomeIcon icon={faXTwitter} />
                </Link>
                <Link href="https://instagram.com/ewa.bahrain" sx={{ ...iconStyles.base, ...iconStyles.instagram }} target="_blank">
                  <InstagramIcon />
                </Link>
                <Link href="https://www.youtube.com/channel/UCqVMLfnFwkuEoaoJYy-H6ow" sx={{ ...iconStyles.base, ...iconStyles.youtube }} target="_blank">
                  <YouTubeIcon />
                </Link>
              </Grid>
              <Copyright />
            </Grid>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>Legal</Typography>
            <Link href="/Terms" sx={{ color: 'white', display: 'block', textDecoration: 'none' }}>Terms</Link>
            <Link href="/Privacy" sx={{ color: 'white', textDecoration: 'none' }}>Privacy</Link>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>Our Hours</Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>Monday-Friday: 9am-5pm</Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>Saturday: 10am-2pm</Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>Sunday: Closed</Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>Service Governates</Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>Central Municipal</Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>Muharraq Municipal</Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>Northern Municipal</Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>Southern Municipal</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: 'white' }}>Language</Typography>
            <TextField
              select
              size="medium"
              variant="standard"
              SelectProps={{ native: true }}
              sx={{
                mt: 1,
                width: 180,
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '.MuiInputBase-root': { color: 'white' },
                '.MuiInput-underline:before': { borderBottomColor: 'white' },
                '.MuiInput-underline:after': { borderBottomColor: 'white' },
                '.MuiNativeSelect-select': { backgroundColor: 'black' },
              }}
            >
              {LANGUAGES.map(language => (
                <option key={language.code} value={language.code} style={{ backgroundColor: 'black', color: 'white' }}>
                  {language.name}
                </option>
              ))}
            </TextField>
            <Typography variant="h6" sx={{ color: 'white', mt: 2 }}>
              Subscribe to our Newsletter
            </Typography>
            <Button variant="contained" color="primary" onClick={handleSubscribeOpen} sx={{ mt: 1 }}>
              Subscribe
            </Button>
            <Button variant="contained" color="secondary" onClick={handleUnsubscribeOpen} sx={{ mt: 1, ml: 2 }}>
              Unsubscribe
            </Button>
          </Grid>
        </Grid>
      </Container>
      <SubscribeForm open={subscribeOpen} onClose={handleSubscribeClose} />
      <UnsubscribeForm open={unsubscribeOpen} onClose={handleUnsubscribeClose} />
    </Box>
  );
}
