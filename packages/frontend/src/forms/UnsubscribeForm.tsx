import React, { useState } from 'react';
import { Box, Button, Modal, Typography, CircularProgress, Alert } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import exportString from '../api_url';

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

interface UnsubscribeFormProps {
  open: boolean;
  onClose: () => void;
}

const UnsubscribeForm: React.FC<UnsubscribeFormProps> = ({ open, onClose }) => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [messageSeverity, setMessageSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (value: string) => {
    setPhone(`+${value}`);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/unsubscribe`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }), // Ensure this matches the server's expected format
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        setMessageSeverity('success');
      } else {
        setMessage(result.message || result.error || 'Failed to unsubscribe.');
        setMessageSeverity('error');
      }
    } catch (error) {
      setMessage('Network error, please try again later.');
      setMessageSeverity('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="unsubscribe-modal-title" aria-describedby="unsubscribe-modal-description">
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
          p: 4,
          borderRadius: 2,
          border: 'none',
        }}
      >
        <Typography id="unsubscribe-modal-title" variant="h6" component="h2" sx={{ color: 'white' }}>
          Unsubscribe from the Newsletter
        </Typography>
        <PhoneInput
          country={'bh'}
          value={phone}
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
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, mb: 2 }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Unsubscribe'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose} fullWidth>
          Cancel
        </Button>
        {message && (
          <Alert severity={messageSeverity} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Box>
    </Modal>
  );
};

export default UnsubscribeForm;
