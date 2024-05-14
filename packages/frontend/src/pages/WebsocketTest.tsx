import useWebSocket from "react-use-websocket";
import { useUser } from "../UserContext";
import React, { useEffect, useRef, useState } from "react";


const WebsocketTest = () => {
    const user_id = useUser();

    if (user_id.userCustomId !== null) {
    
        const { sendMessage, lastMessage, readyState } = useWebSocket(
          `wss://${import.meta.env.VITE_API_URL}/`,
    
          {
            queryParams: { user_id: user_id.userCustomId! },
            onOpen: () => {
              console.log("======================connected========================");
            },
            onMessage(event) {
              console.log(event.data);
              const eventJSON = JSON.parse(event.data);
              console.log(eventJSON, "eventJSON");
              if (eventJSON.message.exit_time === null) {
              } else {
                console.log('message not found')
              }
            },
          }
        );
      } else {
        console.log("no id");
      }

      

      
    return (
       
    );
};

export default WebsocketTest;
