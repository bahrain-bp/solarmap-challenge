import React, { useState, useEffect } from "react";
import uploadFile from "../uploadFile";

type ListenFunction = (url: string) => void;

const DocumentUpload: React.FC = () => {
  const [, setUploadedFileUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [canUpload, setCanUpload] = useState<boolean>(true);

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

  useEffect(() => {
    let uploadTimer: NodeJS.Timeout;

    if (!canUpload) {
      // Start a timer to reset the upload button state after 1 minute
      uploadTimer = setTimeout(() => {
        setCanUpload(true);
      }, 60000); // 1 minute = 60,000 milliseconds
    }

    return () => {
      clearTimeout(uploadTimer);
    };
  }, [canUpload]);

  const handleListen: ListenFunction = (url) => {
    setUploadedFileUrl(url);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fileInput = document.querySelector("#formFileLg") as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    setErrorMessage(""); // Reset error message
    setSuccessMessage(""); // Reset success message

    if (canUpload && file) {
      setCanUpload(false); // Disable uploading for 1 minute
      setUploading(true); // Set uploading state to true
      setErrorMessage("");
      try {
        const fileType = file.type.split("/")[1];
        if (fileType !== "png" && fileType !== "jpeg" && fileType !== "pdf") {
          throw new Error("Invalid file type. Please select a PNG, JPEG, or PDF file.");
        }

        const fileUrl = await uploadFile(file, file.type);
        handleListen(fileUrl);
        setSuccessMessage("File uploaded successfully!");
        setUploading(false); // Set uploading state to false
        setErrorMessage("");
      } catch (error) {
        console.error("Error uploading file:", error);
        setErrorMessage("An error occurred while uploading the file. Please try again later.");
        setUploading(false); // Set uploading state to false
      }
    } else if (!file) {
      setErrorMessage("Please select a file to upload.");
    }
  };

  return (
    <>
      <form id="fileForm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <h4>To get accurate and precise solar panel installation results matching your needs</h4>
          <br />
          <label htmlFor="formFileLg" className="form-label">Upload Your MEWA Bill Document File:</label>
          <input className="form-control" id="formFileLg" type="file" accept=".pdf, .png, .jpeg" />
          <p style={{ fontSize: "12px" }}>Acceptable files are *.pdf, *.png, and *.jpeg</p>
        </div>
        <button className="btn btn-primary" type="submit" disabled={uploading || !canUpload}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      </form>
      <br />
      <p style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Example of Document:</p>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img style={{ height: "600px" }} src="https://imgv2-2-f.scribdassets.com/img/document/638375183/original/44c2ab4867/1710903548?v=1" alt="Example document" />
      </div>
    </>
  );
};

export default DocumentUpload;
