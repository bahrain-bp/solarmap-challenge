import React, { useEffect, useRef, useState } from 'react';
import { createEmbeddingContext, EmbeddingContext } from 'amazon-quicksight-embedding-sdk';

interface QuickSightEmbedResponse {
  EmbedUrl: string;
}

const QuickSightDashboard: React.FC = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [dashboardId] = useState<string>('60731b32-1883-450f-99e9-19af71b09054'); // New dashboard ID
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
  const [embeddingContext, setEmbeddingContext] = useState<EmbeddingContext | null>(null);
  const [isDashboardEmbedded, setIsDashboardEmbedded] = useState<boolean>(false);

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/calculatorUsage`);
        const data: QuickSightEmbedResponse = await response.json();
        setDashboardUrl(data.EmbedUrl);
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
          height: '1900px',
          width: '1900px',  
        };

        await embeddingContext.embedDashboard(options);
        setIsDashboardEmbedded(true);
      }
    };

    embedDashboard();
  }, [embeddingContext, isDashboardEmbedded, dashboardUrl]);

  return (
    <div ref={dashboardRef} className="quicksightDashboardContainer" />
  );
};

export default QuickSightDashboard;
