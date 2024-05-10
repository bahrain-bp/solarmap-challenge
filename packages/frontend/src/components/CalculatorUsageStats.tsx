import React, { useEffect, useRef, useState } from 'react';
import { createEmbeddingContext, EmbeddingContext } from 'amazon-quicksight-embedding-sdk';

interface QuickSightEmbedResponse {
  EmbedUrl: string;
}

const QuickSightDashboard: React.FC = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [dashboardId] = useState<string>('60731b32-1883-450f-99e9-19af71b09054'); // Dashboard ID
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
  const [searchBarUrl, setSearchBarUrl] = useState<string | null>(null);
  const [embeddingContext, setEmbeddingContext] = useState<EmbeddingContext | null>(null);
  const [isDashboardEmbedded, setIsDashboardEmbedded] = useState<boolean>(false);
  const [isSearchBarEmbedded, setIsSearchBarEmbedded] = useState<boolean>(false);

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      try {
        // Fetch dashboard embed URL
        const dashboardResponse = await fetch(`${import.meta.env.VITE_API_URL}/calculatorUsage`);
        const dashboardData: QuickSightEmbedResponse = await dashboardResponse.json();
        setDashboardUrl(dashboardData.EmbedUrl);

        // Fetch search bar embed URL
        const searchBarResponse = await fetch(`${import.meta.env.VITE_API_URL}/statisticsSearchBar`);
        const searchBarData: QuickSightEmbedResponse = await searchBarResponse.json();
        setSearchBarUrl(searchBarData.EmbedUrl);
      } catch (error) {
        console.error('Error fetching URLs:', error);
      }
    };

    fetchEmbedUrl();
  }, [dashboardId]);

  useEffect(() => {
    const initEmbeddingContext = async () => {
      if ((dashboardUrl || searchBarUrl) && !embeddingContext) {
        const context = await createEmbeddingContext();
        setEmbeddingContext(context);
      }
    };

    initEmbeddingContext();
  }, [dashboardUrl, searchBarUrl, embeddingContext]);

  useEffect(() => {
    const embedDashboard = async () => {
      if (embeddingContext && dashboardRef.current && dashboardUrl && !isDashboardEmbedded) {
        const options = {
          url: dashboardUrl,
          container: dashboardRef.current,
          height: '2000px',
          width: '100%',
        };

        await embeddingContext.embedDashboard(options);
        setIsDashboardEmbedded(true);
      }
    };

    embedDashboard();
  }, [embeddingContext, isDashboardEmbedded, dashboardUrl]);

  useEffect(() => {
    const embedSearchBar = async () => {
      if (embeddingContext && searchBarRef.current && searchBarUrl && !isSearchBarEmbedded) {
        const options = {
          url: searchBarUrl,
          container: searchBarRef.current,
          height: '50px',  // Adjust height as needed
          width: '100%',  // Adjust width as needed for responsive design
        };

        await embeddingContext.embedQSearchBar(options);
        setIsSearchBarEmbedded(true);
      }
    };

    embedSearchBar();
  }, [embeddingContext, isSearchBarEmbedded, searchBarUrl]);

  return (
    <>
      <div className="container mt-4 mb-4">
        <h1 className="text-center">Dashboard: Calculator Usage Insights</h1>
        <p className="text-center text-muted">
          This dashboard provides a visual analysis of the usage patterns of our calculator tools. Explore interactive data representations to understand user engagement and operational metrics.
        </p>
      </div>
      <div ref={searchBarRef} className="quicksightSearchBarContainer" />
      <div ref={dashboardRef} className="quicksightDashboardContainer" />
    </>
  );
};

export default QuickSightDashboard;
