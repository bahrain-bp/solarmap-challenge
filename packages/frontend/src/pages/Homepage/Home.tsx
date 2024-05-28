import * as React from 'react';
import SolarHero from './SolarHero';
import SolarValues from './SolarValues';
import SolarFeatures from './SolarFeatures';
import withRoot from '../../withRoot';
import SolarGetInTouch from './SolarGetInTouch';
import { useEffect, useState } from 'react';

function Home() {

  const [message, setMessage] = useState("");

  //////// Web Socket Connection //////////

  useEffect(() => {
  // const url = "wss://zrzuvslvoj.execute-api.us-east-1.amazonaws.com/husain" // WebSocket URL
  const webSocketUrl = import.meta.env.VITE_WEB_SOCKET_API_KEY; 
   console.log(webSocketUrl);
    // Connect to the WebSocket
   // Connect to the WebSocket
   const newSocket = new WebSocket(webSocketUrl);

   // Connection opened
   newSocket.addEventListener("open", (event) => {
     console.log("WebSocket connection opened:", event);
   });

   // Listen for messages
   newSocket.addEventListener("message", (event) => {
     console.log("WebSocket received a message:", event.data);
     setMessage(event.data);
   });


   // Connection closed
   newSocket.addEventListener("close", (event) => {
     console.log("WebSocket connection closed:", event);
   });

   // Connection error
   newSocket.addEventListener("error", (event) => {
     console.error("WebSocket connection error:", event);
   });

    console.log(message);
   
   return () => {
     newSocket.close();
   };

   }, []);

  return (
    <React.Fragment>
      <SolarHero />
      <SolarValues />
      <SolarFeatures />
      <SolarGetInTouch />
    </React.Fragment>
  );
}

export default withRoot(Home);