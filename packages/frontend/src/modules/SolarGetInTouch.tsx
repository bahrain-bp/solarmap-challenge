import { SetStateAction, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLifeRing } from '@fortawesome/free-solid-svg-icons';
import exportString from "../api_url";
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

const API_BASE_URL = exportString();

function SolarGetInTouch() {
  const [feedback, setFeedback] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  const handleFeedbackChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      await fetch(`${API_BASE_URL}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback_content: feedback }),
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setFeedback("");
      setOpen(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        onClick={handleOpen}
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
      <Typography variant="subtitle1">
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="feedback-modal-title"
        aria-describedby="feedback-modal-description"
      >
        <Box
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
          <Typography id="feedback-modal-title" variant="h6" component="h2">
            Feedback
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              id="feedback"
              label="Your Feedback"
              multiline
              rows={4}
              value={feedback}
              onChange={handleFeedbackChange}
              fullWidth
              required
              sx={{ mt: 2, mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
            {submitSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Feedback submitted successfully!
              </Alert>
            )}
          </form>
        </Box>
      </Modal>
    </Container>
  );
}

export default SolarGetInTouch;
