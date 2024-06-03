import React, { useState } from 'react';
import exportString from '../../api_url';
import { Box, Button, TextField, Typography, Alert, CircularProgress } from '@mui/material';

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

interface EditEducationalResourceProps {
  resource: {
    resource_id: string;
    title: string;
    body: string;
    resource_url: string;
    resource_img: string | null;
  };
  onClose: () => void;
}

const EditEducationalResource: React.FC<EditEducationalResourceProps> = ({ resource, onClose }) => {
  const [title, setTitle] = useState(resource.title);
  const [body, setBody] = useState(resource.body);
  const [resourceUrl, setResourceUrl] = useState(resource.resource_url);
  const [resourceImg, setResourceImg] = useState(resource.resource_img);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title) newErrors.title = 'Title is required';
    if (!body) newErrors.body = 'Body is required';
    if (!resourceUrl) newErrors.resourceUrl = 'Resource URL is required';
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

    const resourceData = JSON.stringify({
      resource_id: resource.resource_id,
      title,
      body,
      resource_url: resourceUrl,
      resource_img: resourceImg
    });

    try {
      const response = await fetch(`${API_BASE_URL}/resources/${resource.resource_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: resourceData
      });

      if (!response.ok) throw new Error('Failed to update resource');

      setMessage('Resource updated successfully');
      setTimeout(() => {
        onClose(); // Close the modal on successful submit
      }, 1500); // Wait for 1.5 seconds before closing the modal
    } catch (error: any) {
      setMessage(error.message || 'Failed to update resource');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Edit Educational Resource
      </Typography>
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        required
        value={title}
        onChange={e => setTitle(e.target.value)}
        sx={{ mb: 2 }}
        error={!!errors.title}
        helperText={errors.title}
      />
      <TextField
        label="Body"
        variant="outlined"
        fullWidth
        required
        multiline
        rows={4}
        value={body}
        onChange={e => setBody(e.target.value)}
        sx={{ mb: 2 }}
        error={!!errors.body}
        helperText={errors.body}
      />
      <TextField
        label="Resource URL"
        variant="outlined"
        fullWidth
        value={resourceUrl}
        onChange={e => setResourceUrl(e.target.value)}
        sx={{ mb: 2 }}
        error={!!errors.resourceUrl}
        helperText={errors.resourceUrl}
      />
      <TextField
        label="Image URL"
        variant="outlined"
        fullWidth
        value={resourceImg || ''}
        onChange={e => setResourceImg(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box sx={{ position: 'relative' }}>
        <Button type="submit" variant="contained" color="primary" disabled={isLoading} fullWidth sx={{ mb: 2 }}>
          Update Resource
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

export default EditEducationalResource;
