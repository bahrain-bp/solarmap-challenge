import { Container, Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { Handshake, EnergySavingsLeaf, Mic, People, Star, Lightbulb } from "@mui/icons-material";
import EduRes from "../assets/Educationalresources.jpg";

const Terms = () => {
    return (
        <>
            {/* Hero Image with Text Overlay */}
            <Box
                sx={{
                    position: 'relative',
                    height: 500,
                    backgroundImage: `url(${EduRes})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#fff',
                    textShadow: '2px 4px 5px rgba(0,0,0,0.7)',
                }}
            >
                <Typography variant="h1" component="h1" sx={{ fontWeight: 'bold' }}>Terms of Service</Typography>
            </Box>

            {/* Jumbotron */}
            <Container sx={{ py: 6 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" component="h2" gutterBottom>
                        Our Terms
                    </Typography>
                </Box>
            </Container>

            {/* Mission and Vision Section */}
            <Box sx={{ bgcolor: 'background.default', py: 6 }}>
                <Container>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 2, boxShadow: 2 }}>
                                <Typography variant="h4" component="h2" gutterBottom>
                                    Privacy Policy
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: 18, lineHeight: 1.7, color: 'text.secondary' }}>
                                    Your privacy is important to us. Our Privacy Policy outlines how we collect, use, and disclose your personal information when you use our services. By accessing or using our platform, you agree to the terms outlined in our Privacy Policy. In addition, we reserve the right to update or modify our guidelines at any time, and your continued use of our platform constitutes acceptance of any such changes.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 2, boxShadow: 2 }}>
                                <Typography variant="h4" component="h2" gutterBottom>
                                    User Conduct
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: 18, lineHeight: 1.7, color: 'text.secondary' }}>
                                    We aim to foster a positive and inclusive community within our platform. By accessing our services, you agree to engage in conduct that is respectful, lawful, and considerate towards others. Any behavior deemed inappropriate, including but not limited to harassment, discrimination, or misuse of our platform, may result in restriction of access or other measures as deemed necessary by us.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Values Section */}
            <Container sx={{ py: 6 }}>
                <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
                    Our Core Values
                </Typography>
                <Grid container spacing={6}>
                    {[
                        { icon: <Handshake fontSize="large" />, title: "Integrity", description: "Commitment to honesty and fairness." },
                        { icon: <EnergySavingsLeaf fontSize="large" />, title: "Sustainability", description: "Advocating for environmental conservation." },
                        { icon: <Mic fontSize="large" />, title: "Transparency", description: "Open and clear communication in all our dealings." },
                        { icon: <People fontSize="large" />, title: "Customer-Centric", description: "Placing customer needs at the heart of our operations." },
                        { icon: <Star fontSize="large" />, title: "Excellence", description: "Striving for superior performance and innovation." },
                        { icon: <Lightbulb fontSize="large" />, title: "Excellence", description: "Fostering creativity to enhance innovation." },
                    ].map((value, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card sx={{ height: '100%', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-8px)' } }}>
                                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                                    <Box sx={{ mb: 2, color: 'primary.main' }}>{value.icon}</Box>
                                    <Typography variant="h5" component="h3" gutterBottom>
                                        {value.title}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                        {value.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
}

export default Terms;
