import { useState } from 'react';
import exportString from '../../api_url';
import { Box, Button, TextField, Typography, Alert, CircularProgress } from '@mui/material';

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

interface AddEducationalResourceProps {
  onClose: () => void;
}

const AddEducationalResource: React.FC<AddEducationalResourceProps> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title) newErrors.title = 'Title is required';
    if (!body) newErrors.body = 'Body is required';
    if (!imageUrl) newErrors.imageUrl = 'Image URL is required';
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
      title,
      body,
      resource_url: resourceUrl,
      resource_img: imageUrl
    });

    try {
      const response = await fetch(`${API_BASE_URL}/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: resourceData
      });

      if (!response.ok) throw new Error('Failed to upload resource');

      setMessage('Resource added successfully');
      setTimeout(() => {
        onClose(); // Close the modal on successful submit
      }, 1500); // Wait for 1.5 seconds before closing the modal
    } catch (error: any) {
      setMessage(error.message || 'Failed to add resource');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add Educational Resource
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
        value={imageUrl}
        onChange={e => setImageUrl(e.target.value)}
        sx={{ mb: 2 }}
        error={!!errors.imageUrl}
        helperText={errors.imageUrl}
      />
      <Box sx={{ position: 'relative' }}>
        <Button type="submit" variant="contained" color="primary" disabled={isLoading} fullWidth sx={{ mb: 2 }}>
          Add Resource
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

export default AddEducationalResource;
