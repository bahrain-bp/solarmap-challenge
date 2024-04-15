const config = {
    // Backend config
    s3: {
      REGION: import.meta.env.VITE_REGION,
      BUCKET: import.meta.env.VITE_BUCKET,
    },
    apiGateway: {
      REGION: import.meta.env.VITE_REGION,
      URL: import.meta.env.VITE_API_URL,
    },
    cognito: {
      REGION: import.meta.env.VITE_REGION,
      USER_POOL_ID: 'us-east-1_h0klyV1Fh',
      APP_CLIENT_ID: '3olj46jq032k608urtfsvr5s56',
      IDENTITY_POOL_ID: "us-east-1:df87831b-c0d8-4793-a5b0-ee9adae507eb",
    },
  };
  
  export default config;