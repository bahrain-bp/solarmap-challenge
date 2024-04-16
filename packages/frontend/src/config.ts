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
      USER_POOL_ID: 'us-east-1_jZREPAFHe',
      APP_CLIENT_ID: '6g5dhun2num1ebkuv6ltcp4fpd',
      IDENTITY_POOL_ID: "us-east-1:95315ace-357f-4340-a874-edfc80c72ea0",
    },
  };
  
  export default config;