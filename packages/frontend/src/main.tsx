import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Amplify } from "aws-amplify"
import { Authenticator } from "@aws-amplify/ui-react"
// require('dotenv').config();

// Amplify.configure({
//   Auth: {
//     region: process.env.REGION,
//     userPoolId: process.env.USER_POOL_ID,
//     userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID,
//   },
// });




ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Authenticator.Provider>
    <App />
    </Authenticator.Provider>
  </React.StrictMode>,
)
