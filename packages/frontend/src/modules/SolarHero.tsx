import Button from '../components/Button';
import Typography from '../components/Typography';
import SolarHeroLayout from './SolarHeroLayout';
import video from '../assets/herovideo.mp4'; // Adjust the import path as needed

export default function SolarHero() {
  return (
    <SolarHeroLayout
      sxBackground={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          zIndex: -1,
        }}
      >
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

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
        component="a"
        href="/premium-themes/onepirate/sign-up/"
        sx={{ minWidth: 200 }}
      >
        Get Started
      </Button>
      <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
        Discover the experience
      </Typography>
    </SolarHeroLayout>
  );
}
