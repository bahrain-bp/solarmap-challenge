import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify';

const userPoolId = "us-east-1_yJLupftez";
const userPoolClientId = "7h6ao9muqtfgds5ku5qonqs9p3";

if (!userPoolId || !userPoolClientId) {
  throw new Error("Environment variables USER_POOL_ID and USER_POOL_CLIENT_ID are required.");
}

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
