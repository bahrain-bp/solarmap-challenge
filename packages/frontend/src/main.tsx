import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito:{
      userPoolId: process.env.USER_POOL_ID,
      userPoolClientId: "9l2ocqtm5pic58dc7qm6a9qda",
    }
  },
  API: {
    endpoints: [
      {
        name: "api",
        endpoint: import.meta.env.VITE_APP_API_URL,
        region: import.meta.env.VITE_APP_REGION,
      },
    ],
  },
} as any);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
