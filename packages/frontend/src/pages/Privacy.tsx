import { Container, Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { Handshake, EnergySavingsLeaf, Mic, People, Star, Lightbulb } from "@mui/icons-material";
import solarprovider from "../assets/solarprovider.jpg";

const Privacy = () => {
    return (
        <>
            {/* Hero Image with Text Overlay */}
            <Box
                sx={{
                    position: 'relative',
                    height: 500,
                    backgroundImage: `url(${solarprovider})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#fff',
                    textShadow: '2px 4px 5px rgba(0,0,0,0.7)',
                }}
            >
                <Typography variant="h1" component="h1" sx={{ fontWeight: 'bold' }}>Privacy Policy</Typography>
            </Box>

            {/* Data Collection and Usage Section */}
            <Box sx={{ bgcolor: 'background.default', py: 6 }}>
                <Container>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 2, boxShadow: 2 }}>
                                <Typography variant="h4" component="h2" gutterBottom>
                                    Data Collection and Usage
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: 18, lineHeight: 1.7, color: 'text.secondary' }}>
                                    We value your privacy at SolarMap. Our Privacy Policy governs how we collect, use, and share your personal information. This includes data you provide directly to us and information collected automatically through cookies and similar technologies. By using our services, you agree to our practices outlined in this Privacy Policy.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 2, boxShadow: 2 }}>
                                <Typography variant="h4" component="h2" gutterBottom>
                                    Data Sharing and Protection
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: 18, lineHeight: 1.7, color: 'text.secondary' }}>
                                    At SolarMap, we prioritize the security of your personal information. We only share your data with trusted third-party service providers as necessary to deliver our services. While we take reasonable measures to protect your data, please be aware that no method of transmission over the internet is completely secure. By using our platform, you acknowledge and accept these risks associated with data transmission.
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
                        { icon: <Lightbulb fontSize="large" />, title: "Creativity", description: "Fostering creativity to enhance innovation." },
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

export default Privacy;
