import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Carousel from 'react-material-ui-carousel';
import GuideHeader from '../assets/getstarted.jpg';
import BillUploadImg from '../assets/ewabill.jpg';
import MapImg from '../assets/bahrainmap.png';
import ChatbotImg from '../assets/chatbot-3-ezgif.com-webp-to-jpg-converter.jpg';
import carousel1 from '../assets/Screenshot 2024-06-19 220412.png';
import carousel2 from '../assets/carousel2.png';
import carousel3 from '../assets/carousel3.png';
import carousel4 from '../assets/carousel4.png';

const GetStarted: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    const slides = [
        {
            title: "Choose One Approach",
            description: "First, choose one of the three approaches to get started.",
            image: carousel1,
        },
        {
            title: "Input Required Data",
            description: "Input the required data for the selected approach.",
            image: carousel2,
        },
        {
            title: "Verify Results",
            description: "Verify the results of the analysis.",
            image: carousel3,
        },
        {
            title: "Inquire from Administrators",
            description: "Proceed to inquire from administrators if needed.",
            image: carousel4,
        },
    ];

    return (
        <Box sx={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box sx={{ position: 'relative', width: '100%', height: '300px', mb: 0, overflow: 'hidden' }}>
                <img
                    src={GuideHeader}
                    alt="Guide"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'brightness(70%) blur(3px)',
                        marginBottom: '-5px',
                        borderRadius: '0'
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h3" component="h1" gutterBottom>
                        Get Started
                    </Typography>
                    <Typography variant="h6">
                        Explore our comprehensive guide to help you navigate through the resources and tools we offer.
                    </Typography>
                </Box>
            </Box>

            <Container sx={{ py: { xs: 2, sm: 2 } }}>
                <Carousel>
                    {slides.map((slide, index) => (
                        <Box key={index} sx={{ textAlign: 'center', px: 2 }}>
                            <img
                                src={slide.image}
                                alt={slide.title}
                                style={{
                                    width: '100%',
                                    height: '300px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    marginBottom: '16px'
                                }}
                            />
                            <Typography variant="h4" gutterBottom>
                                {slide.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {slide.description}
                            </Typography>
                        </Box>
                    ))}
                </Carousel>
            </Container>

            <Container sx={{ py: { xs: 4, sm: 8 } }}>
                <Typography component="h2" variant="h4" color="text.primary" sx={{ pb: 4 }}>
                    How the System Works
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Our system offers three different approaches to assess and install solar panels on your property.
                    You can choose from EWA Bill Upload, Map, or Chatbot to get started.
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                            <CardMedia
                                component="img"
                                alt="EWA Bill Upload"
                                height="200"
                                image={BillUploadImg}
                                title="EWA Bill Upload"
                            />
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h4" component="h2" gutterBottom>
                                    EWA Bill Upload
                                </Typography>
                                <Button variant="contained" color="primary" onClick={() => handleNavigate('/DocumentUpload')}>
                                    Get Started
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                            <CardMedia
                                component="img"
                                alt="Map"
                                height="200"
                                image={MapImg}
                                title="Map"
                            />
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h4" component="h2" gutterBottom>
                                    Map
                                </Typography>
                                <Button variant="contained" color="primary" onClick={() => handleNavigate('/MapV2')}>
                                    Get Started
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <CardMedia
                                component="img"
                                alt="Chatbot"
                                height="200"
                                image={ChatbotImg}
                                title="Chatbot"
                            />
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                <Typography variant="h4" component="h2" gutterBottom>
                                    Chatbot
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Please click on the chatbot icon at the bottom right to start.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default GetStarted;
