import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Modal, Alert, CircularProgress } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import exportString from '../api_url';
import solargif from '../assets/SolarGif4.gif';

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

interface SubscribeFormProps {
  open: boolean;
  onClose: () => void;
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setLoading(true);
    postMessage(null);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        postMessage(result.message);
        setFormSubmitted(true);
      } else {
        setError(result.message); // Assuming the server sends back a 'message' field on errors
      }
    } catch (error) {
      setError('Failed to add resource and send SMS');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="subscribe-modal-title" aria-describedby="subscribe-modal-description">
      <Box
        component="form"
        onSubmit={handleFormSubmit}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          backgroundColor: '#303434',
          boxShadow: 24,
          p: 0,
          borderRadius: 2,
          border: 'none',
        }}
      >
        {formSubmitted ? (
          <Box
            sx={{
              textAlign: 'center',
              backgroundColor: '#303434',
              p: 4,
              borderRadius: 2,
              color: 'white',
            }}
          >
            <Typography variant="h5" component="h2" sx={{ color: 'white' }}>
              Thank you for subscribing!
            </Typography>
            <img src={solargif} alt="Thank you" style={{ marginTop: '16px', width: '100%', height: 'auto' }} />
          </Box>
        ) : (
          <>
            <Typography id="subscribe-modal-title" variant="h6" component="h2" sx={{ color: 'white' }}>
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
              disabled={loading}
              sx={{ mt: 2, backgroundColor: 'white' }}
            />
            <TextField
              id="last_name"
              name="last_name"
              label="Last Name"
              value={formData.last_name}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={loading}
              sx={{ mt: 2, backgroundColor: 'white' }}
            />
            <TextField
              id="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={loading}
              sx={{ mt: 2, backgroundColor: 'white' }}
            />
            <PhoneInput
              country={'bh'}
              value={formData.phone}
              onChange={handlePhoneChange}
              inputStyle={{ width: '100%', backgroundColor: 'white' }}
              containerStyle={{ width: '100%', marginTop: '16px' }}
              inputProps={{
                name: 'phone',
                required: true,
                autoFocus: true,
                disabled: loading,
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
              <Button variant="outlined" color="secondary" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
            </Box>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default SubscribeForm;
