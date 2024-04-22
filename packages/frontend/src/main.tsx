import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito:{
      userPoolId: "us-east-1_QpFyNeiol",
      userPoolClientId: "3h3ute414vt7iv3vi1qmibotj7",
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
