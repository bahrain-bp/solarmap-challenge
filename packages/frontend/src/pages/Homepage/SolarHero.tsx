import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Typography from '../../components/Typography';
import SolarHeroLayout from './SolarHeroLayout';
import video from '../../assets/herovideo.mp4'; // Adjust the import path as needed

export default function SolarHero() {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/GetStarted');
  };

  return (
    <SolarHeroLayout
      sxBackground={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background video */}
      <video
        id="background-video"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1, // Ensure video is behind other elements
        }}
        autoPlay
        loop
        muted
      >
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
          zIndex: 2, // Ensure overlay is above video but below content
        }}
      ></div>

      {/* Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 3, // Ensure content is in front of the overlay
          textAlign: 'center',
          color: 'white', // Ensure text is visible against the video background
        }}
      >
        <Typography color="inherit" align="center" variant="h2">
          Solar Map
        </Typography>
        <Typography
          color="inherit"
          align="center"
          variant="h5"
          sx={{ mb: 4, mt: { xs: 4, sm: 10 } }}
        >
          Welcome to Your Solar Journey!
        </Typography>
        <Button
          color="secondary"
          variant="contained"
          size="large"
          onClick={handleGetStartedClick}
          sx={{ minWidth: 200 }}
        >
          Get Started
        </Button>
        <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
          Discover the experience
        </Typography>
      </div>
    </SolarHeroLayout>
  );
}
