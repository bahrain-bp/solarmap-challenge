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
import GuideHeader from '../assets/guide.jpg';
import BillUploadImg from '../assets/ewabill.jpg';
import MapImg from '../assets/bahrainmap.png';
import ChatbotImg from '../assets/chatbot-3-ezgif.com-webp-to-jpg-converter.jpg';

const GetStarted: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    return (
        <Box sx={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box sx={{ position: 'relative', width: '100%', height: '300px', mb: 4, overflow: 'hidden' }}>
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
            <Container sx={{ py: { xs: 8, sm: 16 } }}>
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
                        <Card sx={{ height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                            <CardMedia
                                component="img"
                                alt="Chatbot"
                                height="200"
                                image={ChatbotImg}
                                title="Chatbot"
                            />
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h4" component="h2" gutterBottom>
                                    Chatbot
                                </Typography>
                                <Button variant="contained" color="primary" onClick={() => handleNavigate('/Chatbot')}>
                                    Get Started
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default GetStarted;
