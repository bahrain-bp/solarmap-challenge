import React, { useState } from 'react';
import exportString from "../api_url";
import { Box, Button, Container, Grid, Link, Typography, TextField, Modal, Alert } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

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
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      phone: `+${value}`,
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log('Submitting form data:', formData); // Log the data being submitted

    try {
      const response = await fetch(`${API_BASE_URL}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Response:', result); // Log the response

      if (response.ok) {
        setMessage(result.message);
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      console.error('Error submitting form data:', error); // Log any errors
      setMessage('Failed to add resource and send SMS');
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box component="footer" sx={{ display: 'flex', bgcolor: 'black', color: 'white' }}>
      <Container sx={{ my: 8, display: 'flex' }}>
        <Grid container spacing={5}>
          <Grid item xs={6} sm={4} md={3}>
            <Grid container direction="column" justifyContent="flex-end" spacing={2} sx={{ height: 120 }}>
              <Grid item sx={{ display: 'flex' }}>
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
            <Typography variant="h6" gutterBottom sx={{ color: 'white', mt: 4 }}>
              Subscribe to our Newsletter
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Subscribe
            </Button>
          </Grid>
        </Grid>
      </Container>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="subscribe-modal-title"
        aria-describedby="subscribe-modal-description"
      >
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="subscribe-modal-title" variant="h6" component="h2">
            Subscribe to the Newsletter
          </Typography>
          <TextField
            id="first_name"
            name="first_name"
            label="First Name"
            value={formData.first_name}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mt: 2 }}
          />
          <TextField
            id="last_name"
            name="last_name"
            label="Last Name"
            value={formData.last_name}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mt: 2 }}
          />
          <TextField
            id="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mt: 2 }}
          />
          <PhoneInput
            country={'bh'}
            value={formData.phone}
            onChange={handlePhoneChange}
            inputStyle={{ width: '100%' }}
            containerStyle={{ width: '100%', marginTop: '16px' }}
            inputProps={{
              name: 'phone',
              required: true,
              autoFocus: true,
            }}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Submit
          </Button>
          {message && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
