import React, { useEffect, useRef, useState } from 'react';
import { createEmbeddingContext, EmbeddingContext } from 'amazon-quicksight-embedding-sdk';

interface QuickSightEmbedResponse {
  EmbedUrl: string;
}

const QuickSightDashboard: React.FC = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null); // Reference for search container
  const [dashboardId] = useState<string>('8260f2dc-bd4e-4c32-b8ce-0b6568c824cf');
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
  const [searchUrl, setSearchUrl] = useState<string | null>(null);
  const [embeddingContext, setEmbeddingContext] = useState<EmbeddingContext | null>(null);
  const [isSearchEmbedded, setIsSearchEmbedded] = useState<boolean>(false);
  const [isDashboardEmbedded, setIsDashboardEmbedded] = useState<boolean>(false);

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/BusinessDashboard`);
        const data: QuickSightEmbedResponse = await response.json();
        setDashboardUrl(data.EmbedUrl);

        const searchResponse = await fetch(`${import.meta.env.VITE_API_URL}/BusinessQSearchBar`);
        const searchData: QuickSightEmbedResponse = await searchResponse.json();
        setSearchUrl(searchData.EmbedUrl);

      } catch (error) {
        console.error('Error fetching dashboard URL:', error);
      }
    };

    fetchEmbedUrl();
  }, [dashboardId]);

  useEffect(() => {
    const initEmbeddingContext = async () => {
      if (dashboardUrl && !embeddingContext) {
        const context = await createEmbeddingContext();
        setEmbeddingContext(context);
      }
    };

    initEmbeddingContext();
  }, [dashboardUrl, embeddingContext]);

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
    const embedSearch = async () => {
      if (embeddingContext && searchRef.current && searchUrl && !isSearchEmbedded) {
        const options = {
          url: searchUrl,
          container: searchRef.current,
          height: '50px',  
          width: '100%', 
        };

        await embeddingContext.embedQSearchBar(options);
        setIsSearchEmbedded(true);
      }
    };

    embedSearch();
  }, [embeddingContext, isSearchEmbedded, searchUrl]);

  return (
    <>
      <div ref={searchRef} className="quicksightSearchContainer" /> {/* Search Container */}
      <div ref={dashboardRef} className="quicksightDashboardContainer" /> {/* Dashboard Container */}
    </>
  );
};

export default QuickSightDashboard;
