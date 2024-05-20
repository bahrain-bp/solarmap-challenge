import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Modal, Alert } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import exportString from '../api_url';

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
  const [message, setMessage] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

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
        setMessage(result.message);
        setFormSubmitted(true);
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage('Failed to add resource and send SMS');
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
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        {formSubmitted ? (
          <Typography variant="h5" component="h2" align="center">
            Thank you for subscribing!
          </Typography>
        ) : (
          <>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
              <Button variant="outlined" color="secondary" onClick={onClose}>
                Cancel
              </Button>
            </Box>
            {message && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {message}
              </Alert>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default SubscribeForm;
