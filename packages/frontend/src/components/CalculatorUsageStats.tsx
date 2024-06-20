import React, { useEffect, useRef, useState } from 'react';
import { createEmbeddingContext, EmbeddingContext } from 'amazon-quicksight-embedding-sdk';
import {
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Divider,
  Tooltip,
  IconButton,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Interface to type the response received for embedding URLs
interface QuickSightEmbedResponse {
  EmbedUrl: string;
}

const QuickSightDashboard: React.FC = () => {
  // References to hold the DOM elements where the dashboard and search bar will be embedded
  const dashboardRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // State to hold the dashboard ID and fetched URLs for the dashboard and search bar
  const [dashboardId] = useState<string>('60731b32-1883-450f-99e9-19af71b09054'); // Static ID for now
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
  const [searchBarUrl, setSearchBarUrl] = useState<string | null>(null);

  // State to manage the embedding context and check if components are embedded
  const [embeddingContext, setEmbeddingContext] = useState<EmbeddingContext | null>(null);
  const [isDashboardEmbedded, setIsDashboardEmbedded] = useState<boolean>(false);
  const [isSearchBarEmbedded, setIsSearchBarEmbedded] = useState<boolean>(false);

  // Effect to fetch both dashboard and search bar URLs on component mount
  useEffect(() => {
    const fetchEmbedUrl = async () => {
      try {
        // Fetch the URL for embedding the dashboard
        const dashboardResponse = await fetch(`${import.meta.env.VITE_API_URL}/calculatorUsage`);
        const dashboardData: QuickSightEmbedResponse = await dashboardResponse.json();
        setDashboardUrl(dashboardData.EmbedUrl);

        // Fetch the URL for embedding the search bar
        const searchBarResponse = await fetch(`${import.meta.env.VITE_API_URL}/statisticsSearchBar`);
        const searchBarData: QuickSightEmbedResponse = await searchBarResponse.json();
        setSearchBarUrl(searchBarData.EmbedUrl);
      } catch (error) {
        console.error('Error fetching URLs:', error);
      }
    };

    fetchEmbedUrl();
  }, [dashboardId]);  // Dependency on dashboardId if it needs to be dynamic in the future

  // Effect to initialize the embedding context once we have the URLs
  useEffect(() => {
    const initEmbeddingContext = async () => {
      if ((dashboardUrl || searchBarUrl) && !embeddingContext) {
        const context = await createEmbeddingContext();
        setEmbeddingContext(context);
      }
    };

    initEmbeddingContext();
  }, [dashboardUrl, searchBarUrl, embeddingContext]);

  // Effect to embed the dashboard once the context is ready and URL is fetched
  useEffect(() => {
    const embedDashboard = async () => {
      if (embeddingContext && dashboardRef.current && dashboardUrl && !isDashboardEmbedded) {
        const options = {
          url: dashboardUrl,
          container: dashboardRef.current,
          height: '2500px',
          width: '100%',
        };

        await embeddingContext.embedDashboard(options);
        setIsDashboardEmbedded(true);
      }
    };

    embedDashboard();
  }, [embeddingContext, isDashboardEmbedded, dashboardUrl]);

  // Effect to embed the search bar using similar logic as the dashboard
  useEffect(() => {
    const embedSearchBar = async () => {
      if (embeddingContext && searchBarRef.current && searchBarUrl && !isSearchBarEmbedded) {
        const options = {
          url: searchBarUrl,
          container: searchBarRef.current,
          height: '50px',  
          width: '100%',  
        };

        await embeddingContext.embedQSearchBar(options);
        setIsSearchBarEmbedded(true);
      }
    };

    embedSearchBar();
  }, [embeddingContext, isSearchBarEmbedded, searchBarUrl]);

  return (
    <Box>
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Tooltip title="The Q search bar allows you to quickly search and filter the dashboard data. Simply type in your query to get insights.">
          <IconButton
            sx={{
              position: 'absolute',
              top: 16,
              left: 28,
              color: '#3f51b5',
            }}
          >
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            marginTop: 4,
            marginBottom: 4,
            background: 'linear-gradient(to right, #f5f5f5, #e0e0e0)',
            boxShadow: '0 3px 5px 2px rgba(105, 105, 105, .3)',
            borderRadius: 2,
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <BarChartIcon sx={{ fontSize: 40, marginRight: 2, color: '#3f51b5' }} />
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
              Dashboard: Calculator Usage Insights
            </Typography>
          </Box>
          <Typography variant="body1" align="center" color="textSecondary" paragraph>
            This dashboard provides a visual analysis of the usage patterns of our calculator tools.
            Explore interactive data representations to understand user engagement and operational metrics.
          </Typography>
          <Divider sx={{ marginY: 4 }} />
        </Paper>
      </Container>
      <Box ref={searchBarRef} />
      <Box ref={dashboardRef} sx={{ height: '2500px', width: '100%' }}>
        {!isDashboardEmbedded && <CircularProgress />}
      </Box>
    </Box>
  );
};

export default QuickSightDashboard;
