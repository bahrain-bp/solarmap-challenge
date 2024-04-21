import React, { useEffect, useRef, useState } from 'react';
import { createEmbeddingContext, EmbeddingContext } from 'amazon-quicksight-embedding-sdk';

const QuickSightDashboard: React.FC = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [dashboardId] = useState<string>('5c860b60-5e39-4a81-857e-4283698b93b2');
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
  const [embeddingContext, setEmbeddingContext] = useState<EmbeddingContext | null>(null);
  const [isEmbedded, setIsEmbedded] = useState<boolean>(false);

  useEffect(() => {
    // Fetch the embed URL for the dashboard
    const fetchEmbedUrl = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/BusinessDashboard`);
        const data = await response.json();
        setDashboardUrl(data.EmbedUrl);
      } catch (error) {
        console.error('Error fetching dashboard URL:', error);
      }
    };

    fetchEmbedUrl();
  }, [dashboardId]);

  useEffect(() => {
    // Initialize the embedding context if not already done
    const initEmbeddingContext = async () => {
      if (dashboardUrl && !embeddingContext) {
        const context = await createEmbeddingContext();
        setEmbeddingContext(context);
      }
    };

    initEmbeddingContext();
  }, [dashboardUrl, embeddingContext]);

  useEffect(() => {
    // Embed the dashboard when the context and URL are ready and not already embedded
    const embedDashboard = async () => {
      if (embeddingContext && dashboardRef.current && dashboardUrl && !isEmbedded) {
        const options = {
          url: dashboardUrl,
          container: dashboardRef.current,
          scrolling: 'no',
          height: '700px',
          width: '100%',
        };

        await embeddingContext.embedDashboard(options);
        setIsEmbedded(true); // Mark as embedded to avoid re-embedding
      }
    };

    embedDashboard();
  }, [embeddingContext, isEmbedded, dashboardUrl]);

  return (
    <div ref={dashboardRef} className="quicksightDashboardContainer" />
  );
};

export default QuickSightDashboard;
