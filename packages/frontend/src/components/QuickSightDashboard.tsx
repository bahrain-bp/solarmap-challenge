import React, { useEffect, useRef, useState } from 'react';
import { createEmbeddingContext, EmbeddingContext } from 'amazon-quicksight-embedding-sdk';

interface QuickSightEmbedResponse {
  EmbedUrl: string;
}

const QuickSightDashboard: React.FC = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [dashboardId] = useState<string>('5c860b60-5e39-4a81-857e-4283698b93b2');
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
  const [embeddingContext, setEmbeddingContext] = useState<EmbeddingContext | null>(null);
  const [isEmbedded, setIsEmbedded] = useState<boolean>(false);

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/BusinessDashboard`);
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
      if (embeddingContext && dashboardRef.current && dashboardUrl && !isEmbedded) {
        const options = {
          url: dashboardUrl,
          container: dashboardRef.current,
          height: '1500px',
          width: '100%',
        };

        await embeddingContext.embedDashboard(options);
        setIsEmbedded(true);
      }
    };

    embedDashboard();
  }, [embeddingContext, isEmbedded, dashboardUrl]);

  return <div ref={dashboardRef} className="quicksightDashboardContainer" />;
};

export default QuickSightDashboard;
