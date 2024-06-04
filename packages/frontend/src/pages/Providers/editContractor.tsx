import React, { useState } from 'react';
import exportString from '../../api_url';
import { Box, Button, TextField, Typography, Alert, CircularProgress, MenuItem } from '@mui/material';

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

interface EditContractorProps {
  contractor: {
    contractor_id: string;
    name: string;
    level: string;
    license_num: string;
    contact_info: string;
    fax: number | null;
  };
  onClose: () => void;
}

const EditContractor: React.FC<EditContractorProps> = ({ contractor, onClose }) => {
  const [name, setName] = useState(contractor.name);
  const [level, setLevel] = useState(contractor.level);
  const [licenseNum, setLicenseNum] = useState(contractor.license_num);
  const [fax, setFax] = useState(contractor.fax ? contractor.fax.toString() : '');
  const [contactInfo, setContactInfo] = useState(contractor.contact_info);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = 'Name is required';
    if (!level) newErrors.level = 'Level is required';
    if (!licenseNum) newErrors.licenseNum = 'License Number is required';
    if (!contactInfo) newErrors.contactInfo = 'Contact Information is required';
    return newErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    const updatedContractorData = {
      contractor_id: contractor.contractor_id,
      name,
      level,
      license_num: licenseNum,
      fax: fax ? parseInt(fax) : null,
      contact_info: contactInfo
    };

    try {
      const response = await fetch(`${API_BASE_URL}/contractors/${contractor.contractor_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedContractorData)
      });

      if (!response.ok) throw new Error('Failed to update contractor');

      setMessage('Contractor updated successfully');
      setTimeout(() => {
        onClose(); // Close the modal on successful submit
      }, 1500); // Wait for 1.5 seconds before closing the modal
    } catch (error: any) {
      setMessage(error.message || 'Failed to update contractor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Edit Contractor
      </Typography>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        required
        value={name}
        onChange={e => setName(e.target.value)}
        sx={{ mb: 2 }}
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        label="Level"
        variant="outlined"
        fullWidth
        required
        value={level}
        onChange={e => setLevel(e.target.value)}
        sx={{ mb: 2 }}
        error={!!errors.level}
        helperText={errors.level}
        select
      >
        <MenuItem value="A">A</MenuItem>
        <MenuItem value="B">B</MenuItem>
        <MenuItem value="C">C</MenuItem>
        <MenuItem value="D">D</MenuItem>
      </TextField>
      <TextField
        label="License Number"
        variant="outlined"
        fullWidth
        required
        value={licenseNum}
        onChange={e => setLicenseNum(e.target.value)}
        sx={{ mb: 2 }}
        error={!!errors.licenseNum}
        helperText={errors.licenseNum}
      />
      <TextField
        label="Fax Number"
        variant="outlined"
        fullWidth
        value={fax}
        onChange={e => setFax(e.target.value.replace(/[^0-9]/g, ""))}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Contact Information"
        variant="outlined"
        fullWidth
        required
        value={contactInfo}
        onChange={e => setContactInfo(e.target.value)}
        sx={{ mb: 2 }}
        error={!!errors.contactInfo}
        helperText={errors.contactInfo}
      />
      <Box sx={{ position: 'relative' }}>
        <Button type="submit" variant="contained" color="primary" disabled={isLoading} fullWidth sx={{ mb: 2 }}>
          Update Contractor
        </Button>
        {isLoading && (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          fullWidth
        >
          Cancel
        </Button>
      </Box>
      {message && <Alert severity="info" sx={{ mt: 2 }}>{message}</Alert>}
    </Box>
  );
};

export default EditContractor;
