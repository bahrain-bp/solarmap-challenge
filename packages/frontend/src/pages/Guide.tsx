import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import GuideHeader from '../assets/guide.jpg';
import ProvidersImg from '../assets/provider1.png';
import ProvidersImg2 from '../assets/provider2.png';
import ProvidersImg3 from '../assets/provider3.png';
import MapImg from '../assets/bahrainmap.png';
import mapstep1 from '../assets/mapstep1.png';
import mapstep2 from '../assets/mapstep2.png';
import mapstep3 from '../assets/mapstep3.png';
// import EduResourceImg from '../assets/types-of-solar-panels-in-india-ezgif.com-webp-to-jpg-converter.jpg';
import EduResourceImg from '../assets/eduresource.png';
import EduResourceImg1 from '../assets/edurecoursestep1.png';
import EduResourceImg3 from '../assets/eduresource3.png';
import BillUploadImg from '../assets/ewabill.jpg';
import carbon from '../assets/carbon1.png';
import carbon2 from '../assets/carbon2.png';
import carbon3 from '../assets/carbon3.png';
import ChatbotImg from '../assets/chatbot-3-ezgif.com-webp-to-jpg-converter.jpg';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import EcoRoundedIcon from '@mui/icons-material/Grass';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';

type TutorialStep = { title: string; heading: string; description: string; image: string };
type Tutorial = { steps: TutorialStep[]; route: string };
type TutorialSteps = { [key: string]: Tutorial };

const tutorialSteps: TutorialSteps = {
    ewaBillUpload: {
        steps: [
            { title: 'STEP 1', heading: 'Upload Bill', description: 'Upload your EWA bill from your computer.', image: BillUploadImg },
            { title: 'STEP 2', heading: 'Verify Details', description: 'Verify the details extracted from the bill.', image: BillUploadImg },
            { title: 'STEP 3', heading: 'Submit', description: 'Submit the verified details for further processing.', image: BillUploadImg },
        ],
        route: '/DocumentUpload',
    },
    map: {
        steps: [
            { title: 'STEP 1', heading: 'Open Map', description: 'Open the map tool from the dashboard and enable the overlay.', image: mapstep1 },
            { title: 'STEP 2', heading: 'Select Area', description: 'Select the area you want to analyze and fill in the remaining details.', image: mapstep2 },
            { title: 'STEP 3', heading: 'View Results', description: 'View the calculation results on the map.', image: mapstep3 },
        ],
        route: '/MapV2',
    },
    providers: {
        steps: [
            { title: 'STEP 1', heading: 'Access', description: 'Go to the providers section.', image: ProvidersImg },
            { title: 'STEP 2', heading: 'Choose', description: 'Search for your chosen provider.', image: ProvidersImg2 },
            { title: 'STEP 3', heading: 'Select', description: 'Click on your chosen provider`s card to display more details.', image: ProvidersImg3 },
        ],
        route: '/Provider',
    },
    educationalResources: {
        steps: [
            { title: 'STEP 1', heading: 'Access', description: 'Go to the educational resources section.', image: EduResourceImg1 },
            { title: 'STEP 2', heading: 'Select', description: 'Choose the resource you want to explore.', image: EduResourceImg },
            { title: 'STEP 3', heading: 'Learn', description: 'Read through the material and watch videos.', image: EduResourceImg3 },
        ],
        route: '/EducationalResources',
    },
    carbonFootprintCalculator: {
        steps: [
            { title: 'STEP 1', heading: 'Open Calculator', description: 'Open the carbon footprint calculator from the dashboard.', image: carbon },
            { title: 'STEP 2', heading: 'Input Data', description: 'Enter your energy consumption data.', image: carbon2 },
            { title: 'STEP 3', heading: 'View Results', description: 'See your carbon footprint and potential savings with solar panels.', image: carbon3 },
        ],
        route: '/CarbonEmissionsCalculator',
    },
    chatbot: {
        steps: [
            { title: 'STEP 1', heading: 'Open Chatbot', description: 'Open the chatbot from the dashboard.', image: ChatbotImg },
            { title: 'STEP 2', heading: 'Ask Questions', description: 'Type your questions about solar panels.', image: ChatbotImg },
            { title: 'STEP 3', heading: 'Get Answers', description: 'Receive instant answers from the chatbot.', image: ChatbotImg },
        ],
        route: '/Guide',
    },
};

const items = [
    {
        icon: <MapRoundedIcon />,
        title: 'Map',
        description: 'Interactive map tool for analysis.',
        imageLight: MapImg,
        imageDark: MapImg,
        extendedDesc: 'Use the interactive map to analyze the solar potential of different areas and make informed decisions about solar panel installations. Enable the overlay and fill in the required details to get instant cost and ROI estimations. Then click on the inquire button to inquire further.',
    },
    {
        icon: <InsertDriveFileRoundedIcon />,
        title: 'Document Upload',
        description: 'Upload your EWA Bills for analysis.',
        imageLight: BillUploadImg,
        imageDark: BillUploadImg,
        extendedDesc: 'Easily upload your EWA bills to get detailed analysis and insights on your energy consumption and potential savings with solar panels.',
    },
    {
        icon: <SchoolRoundedIcon />,
        title: 'Educational Resources',
        description: 'Access a variety of educational materials.',
        imageLight: EduResourceImg,
        imageDark: EduResourceImg,
        extendedDesc: 'Explore a range of educational resources to learn more about solar energy, its benefits, and how it can be implemented in your property.',
    },
    {
        icon: <PeopleRoundedIcon />,
        title: 'Providers',
        description: 'Information about Contractors and Consultants and their services.',
        imageLight: ProvidersImg,
        imageDark: ProvidersImg,
        extendedDesc: 'Get detailed information about contractors and consultants who can help you with your solar panel installation and maintenance needs.',
    },
    {
        icon: <EcoRoundedIcon />,
        title: 'Carbon Footprint Calculator',
        description: 'Calculate your carbon footprint easily.',
        imageLight: carbon,
        imageDark: carbon,
        extendedDesc: 'Calculate your carbon footprint and find out how much you can reduce it by switching to solar energy.',
    },
    {
        icon: <ChatRoundedIcon />,
        title: 'Chatbot',
        description: 'Get instant answers about solar panels.',
        imageLight: ChatbotImg,
        imageDark: ChatbotImg,
        extendedDesc: 'Use our chatbot to get instant answers to your questions about solar panels and their benefits.',
    },
];

const Guide: React.FC = () => {
    const [currentTutorial, setCurrentTutorial] = useState<string>('calculation');
    const [showInitialOptions, setShowInitialOptions] = useState<boolean>(true);
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const navigate = useNavigate();
    const [selectedItemIndex, setSelectedItemIndex] = useState(0);

    const handleItemClick = (index: number) => {
        setSelectedItemIndex(index);
    };

    const selectedFeature = items[selectedItemIndex];

    const handleTutorialChange = (tutorial: string) => {
        setCurrentTutorial(tutorial);
        setShowInitialOptions(true);
    };

    const handleNavigate = () => {
        navigate(tutorialSteps[currentTutorial].route);
    };

    const handleOptionClick = (option: 'ewaBillUpload' | 'map' | 'carbonFootprintCalculator' | 'chatbot') => {
        setCurrentTutorial(option);
        setShowInitialOptions(false);
    };

    const handleBackToCalculation = () => {
        setCurrentTutorial('calculation');
        setShowInitialOptions(true);
    };

    const isCalculationView = currentTutorial === 'calculation' || currentTutorial === 'ewaBillUpload' || currentTutorial === 'map' || currentTutorial === 'carbonFootprintCalculator' || currentTutorial === 'chatbot';

    const handleExpandClick = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <>
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
                            Guide
                        </Typography>
                        <Typography variant="h6">
                            Explore our comprehensive guide to help you navigate through the resources and tools we offer.
                        </Typography>
                    </Box>
                </Box>
                <Container id="features" sx={{ py: { xs: 0, sm: 0 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography component="h2" variant="h4" color="text.primary" sx={{ pb: 0 }}>
                            Our Features
                        </Typography>
                        <IconButton onClick={handleExpandClick}>
                            <ExpandMoreIcon />
                        </IconButton>
                    </Box>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: { xs: 2, sm: 4 } }}
                        >
                            Our app helps you easily assess if solar panels are right for your property. It uses your property data and solar energy potential to give you accurate information. You can upload documents, see a visual of your property with potential solar panels, and get detailed reports on costs and savings. Everything is updated in real-time to make the process simple and efficient for you.
                        </Typography>
                        <Grid container spacing={6}>
                            <Grid item xs={12} md={6}>
                                <Grid container item gap={1} sx={{ display: { xs: 'auto', sm: 'none' } }}>
                                    {items.map(({ title }, index) => (
                                        <Chip
                                            key={index}
                                            label={title}
                                            onClick={() => handleItemClick(index)}
                                            sx={{
                                                borderColor: (theme) => {
                                                    if (theme.palette.mode === 'light') {
                                                        return selectedItemIndex === index ? 'primary.light' : '';
                                                    }
                                                    return selectedItemIndex === index ? 'primary.light' : '';
                                                },
                                                background: (theme) => {
                                                    if (theme.palette.mode === 'light') {
                                                        return selectedItemIndex === index ? 'none' : '';
                                                    }
                                                    return selectedItemIndex === index ? 'none' : '';
                                                },
                                                backgroundColor: selectedItemIndex === index ? 'primary.main' : '',
                                                '& .MuiChip-label': {
                                                    color: selectedItemIndex === index ? '#fff' : '',
                                                },
                                            }}
                                        />
                                    ))}
                                </Grid>
                                <Box
                                    component={Card}
                                    variant="outlined"
                                    sx={{
                                        display: { xs: 'auto', sm: 'none' },
                                        mt: 4,
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        alt={selectedFeature.title}
                                        height="280"
                                        image={selectedFeature.imageLight}
                                        title={selectedFeature.title}
                                    />
                                    <Box sx={{ px: 2, pb: 2 }}>
                                        <Typography color="text.primary" variant="body2" fontWeight="bold">
                                            {selectedFeature.title}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2" sx={{ my: 0.5 }}>
                                            {selectedFeature.description}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2">
                                            {selectedFeature.extendedDesc}
                                        </Typography>
                                        <Link
                                            color="primary"
                                            variant="body2"
                                            fontWeight="bold"
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                '& > svg': { transition: '0.2s' },
                                                '&:hover > svg': { transform: 'translateX(2px)' },
                                            }}
                                        >
                                            <span>Learn more</span>
                                            <ChevronRightRoundedIcon
                                                fontSize="small"
                                                sx={{ mt: '1px', ml: '2px' }}
                                            />
                                        </Link>
                                    </Box>
                                </Box>
                                <Stack
                                    direction="column"
                                    justifyContent="center"
                                    alignItems="flex-start"
                                    spacing={2}
                                    useFlexGap
                                    sx={{ width: '100%', display: { xs: 'none', sm: 'flex' } }}
                                >
                                    {items.map(({ icon, title, description }, index) => (
                                        <Card
                                            key={index}
                                            variant="outlined"
                                            component={Button}
                                            onClick={() => handleItemClick(index)}
                                            sx={{
                                                p: 3,
                                                height: 'fit-content',
                                                width: '100%',
                                                background: 'none',
                                                backgroundColor:
                                                    selectedItemIndex === index ? 'action.selected' : undefined,
                                                borderColor: (theme) => {
                                                    if (theme.palette.mode === 'light') {
                                                        return selectedItemIndex === index
                                                            ? 'primary.light'
                                                            : 'grey.200';
                                                    }
                                                    return selectedItemIndex === index ? 'primary.dark' : 'grey.800';
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    textAlign: 'left',
                                                    flexDirection: { xs: 'column', md: 'row' },
                                                    alignItems: { md: 'center' },
                                                    gap: 2.5,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        color: (theme) => {
                                                            if (theme.palette.mode === 'light') {
                                                                return selectedItemIndex === index
                                                                    ? 'primary.main'
                                                                    : 'grey.300';
                                                            }
                                                            return selectedItemIndex === index
                                                                ? 'primary.main'
                                                                : 'grey.700';
                                                        },
                                                    }}
                                                >
                                                    {icon}
                                                </Box>
                                                <Box sx={{ textTransform: 'none' }}>
                                                    <Typography
                                                        color="text.primary"
                                                        variant="body2"
                                                        fontWeight="bold"
                                                    >
                                                        {title}
                                                    </Typography>
                                                    <Typography
                                                        color="text.secondary"
                                                        variant="body2"
                                                        sx={{ my: 0.5 }}
                                                    >
                                                        {description}
                                                    </Typography>
                                                    <Link
                                                        color="primary"
                                                        variant="body2"
                                                        fontWeight="bold"
                                                        sx={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            '& > svg': { transition: '0.2s' },
                                                            '&:hover > svg': { transform: 'translateX(2px)' },
                                                        }}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                        }}
                                                    >
                                                        <span>Learn more</span>
                                                        <ChevronRightRoundedIcon
                                                            fontSize="small"
                                                            sx={{ mt: '1px', ml: '2px' }}
                                                        />
                                                    </Link>
                                                </Box>
                                            </Box>
                                        </Card>
                                    ))}
                                </Stack>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{ display: { xs: 'none', sm: 'flex' }, width: '100%' }}
                            >
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: '100%',
                                        width: '100%',
                                        display: { xs: 'none', sm: 'flex' },
                                        flexDirection: 'column', // Ensures the content is stacked vertically
                                        pointerEvents: 'none',
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        alt={selectedFeature.title}
                                        height="280"
                                        image={selectedFeature.imageLight}
                                        title={selectedFeature.title}
                                    />
                                    <Box sx={{ p: 2 }}>
                                        <Typography color="text.primary" variant="body2" fontWeight="bold">
                                            {selectedFeature.title}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2" sx={{ my: 0.5 }}>
                                            {selectedFeature.description}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2">
                                            {selectedFeature.extendedDesc}
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Container>

                <Container sx={{ flex: 1, py: 4, pb: 8 }}>
                    <Typography component="h2" variant="h4" color="text.primary" sx={{ pb: 4 }}>
                        Step by Step Tutorials
                    </Typography>

                    <ButtonGroup variant="contained" sx={{ mb: 4 }}>
                        <Button
                            onClick={() => handleTutorialChange('providers')}
                            sx={{
                                backgroundColor: currentTutorial === 'providers' ? 'primary.main' : 'grey.300',
                                color: currentTutorial === 'providers' ? 'common.white' : 'common.black',
                                '&:hover': {
                                    backgroundColor: currentTutorial === 'providers' ? 'primary.dark' : 'grey.400',
                                }
                            }}
                        >
                            Providers
                        </Button>
                        <Button
                            onClick={() => handleTutorialChange('educationalResources')}
                            sx={{
                                backgroundColor: currentTutorial === 'educationalResources' ? 'primary.main' : 'grey.300',
                                color: currentTutorial === 'educationalResources' ? 'common.white' : 'common.black',
                                '&:hover': {
                                    backgroundColor: currentTutorial === 'educationalResources' ? 'primary.dark' : 'grey.400',
                                }
                            }}
                        >
                            Educational Resources
                        </Button>
                        <Button
                            onClick={() => handleTutorialChange('calculation')}
                            sx={{
                                backgroundColor: isCalculationView ? 'primary.main' : 'grey.300',
                                color: isCalculationView ? 'common.white' : 'common.black',
                                '&:hover': {
                                    backgroundColor: isCalculationView ? 'primary.dark' : 'grey.400',
                                }
                            }}
                        >
                            Calculation
                        </Button>
                    </ButtonGroup>
                    {showInitialOptions && currentTutorial === 'calculation' ? (
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <CardMedia
                                        component="img"
                                        alt="EWA Bill Upload"
                                        height="140"
                                        image={BillUploadImg} // Updated image
                                        title="EWA Bill Upload"
                                    />
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Typography variant="h4" component="h2" gutterBottom>
                                            EWA Bill Upload
                                        </Typography>
                                        <Button variant="contained" color="primary" onClick={() => handleOptionClick('ewaBillUpload')}>
                                            Select
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <CardMedia
                                        component="img"
                                        alt="Map"
                                        height="140"
                                        image={MapImg} // Updated image
                                        title="Map"
                                    />
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Typography variant="h4" component="h2" gutterBottom>
                                            Map
                                        </Typography>
                                        <Button variant="contained" color="primary" onClick={() => handleOptionClick('map')}>
                                            Select
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <CardMedia
                                        component="img"
                                        alt="Carbon Footprint Calculator"
                                        height="140"
                                        image={carbon} // Updated image
                                        title="Carbon Footprint Calculator"
                                    />
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Typography variant="h4" component="h2" gutterBottom>
                                            Carbon Footprint 
                                        </Typography>
                                        <Button variant="contained" color="primary" onClick={() => handleOptionClick('carbonFootprintCalculator')}>
                                            Select
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <CardMedia
                                        component="img"
                                        alt="Chatbot"
                                        height="140"
                                        image={ChatbotImg} // Updated image
                                        title="Chatbot"
                                    />
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Typography variant="h4" component="h2" gutterBottom>
                                            Chatbot
                                        </Typography>
                                        <Button variant="contained" color="primary" onClick={() => handleOptionClick('chatbot')}>
                                            Select
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    ) : (
                        <>
                            <Grid container spacing={4}>
                                {tutorialSteps[currentTutorial].steps.map((step, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <CardContent>
                                                <Typography variant="h6" component="h2" gutterBottom>
                                                    {step.title}
                                                </Typography>
                                                <Typography variant="h5" component="h3" gutterBottom>
                                                    {step.heading}
                                                </Typography>
                                                <Typography variant="body1">
                                                    {step.description}
                                                </Typography>
                                            </CardContent>
                                            <CardMedia
                                                component="img"
                                                alt={step.heading}
                                                height="140"
                                                image={step.image} // Use the image from step
                                                title={step.heading}
                                            />
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            {currentTutorial !== 'calculation' && !showInitialOptions && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
                                    <Button variant="contained" color="primary" onClick={handleNavigate}>
                                        Go to {currentTutorial}
                                    </Button>
                                </Box>
                            )}
                        </>
                    )}
                    {['ewaBillUpload', 'map', 'carbonFootprintCalculator', 'chatbot'].includes(currentTutorial) && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
                            <Button variant="contained" color="secondary" onClick={handleBackToCalculation}>
                                Back to Calculation
                            </Button>
                        </Box>
                    )}
                </Container>
            </Box>
        </>
    );
};

export default Guide;
