import useWebSocket from "react-use-websocket";


const WebsocketTest = () => {
   
        
        useWebSocket(
            `wss://zrzuvslvoj.execute-api.us-east-1.amazonaws.com/husain`,

            {
                
                onOpen: () => {
                    console.log("======================connected========================");
                },
                onMessage(event) {
                    console.log(event.data);
                    const eventJSON = JSON.parse(event.data);
                    console.log(eventJSON, "eventJSON");
                   
                },
            }
        );
      

      

      
    return (
       <h1>hello, welcome!</h1>
    );
};

export default WebsocketTest;
