// DocumentUploadWithParent.tsx
import React, { useState } from "react";
import uploadFile from "../uploadFile";

type ListenFunction = (url: string) => void;

const DocumentUpload: React.FC = () => {
  const [, setUploadedFileUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleListen: ListenFunction = (url) => {
    setUploadedFileUrl(url);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fileInput = document.querySelector("#formFileLg") as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    if (file) {
      setErrorMessage("");
      try {
        // Extract file type from the file name or MIME type
        const fileType = file.type.split("/")[1]; // Extracting the file extension from the MIME type
        if (fileType !== "png" && fileType !== "jpeg" && fileType !== "pdf") {
          throw new Error("Invalid file type. Please select a PNG, JPEG, or PDF file.");
        }

        const fileUrl = await uploadFile(file, file.type);

        // Call the listen function with the necessary parameter
        handleListen(fileUrl);

        // Display the uploaded file

        /*
        const link = document.createElement("a");
        link.href = fileUrl;
        link.target = "_blank";
        link.innerText = "Uploaded File";
        document.body.appendChild(link);
        */

        // Clear any previous error messages
        setErrorMessage("");
      } catch (error) {
        // Log the error for debugging
        console.error("Error uploading file:", error);

        // Handle error, e.g., show an error message to the user
        setErrorMessage("An error occurred while uploading the file. Please try again later.");
      }
    } else {
      setErrorMessage("Please select a file to upload.");
    }
  };

  return (
    <>
      <form id="fileForm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <h4> To get accurate and precise solar panel installation results matching your needs</h4>
          <br />
          <label htmlFor="formFileLg" className="form-label">Upload Your MEWA Bill Document File:</label>
          <input className="form-control" id="formFileLg" type="file" accept=".pdf, .png, .jpeg" />
          <p style={{ fontSize: "12px" }}>Acceptable files are *.pdf, *.png, and *.jpeg</p>
        </div>
        <button className="btn btn-primary" type="submit">Upload</button>
        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
      </form>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p>Example of Document:</p>
        <img style={{ height: "600px" }} src="https://imgv2-2-f.scribdassets.com/img/document/638375183/original/44c2ab4867/1710903548?v=1" />
      </div>

    </>
  );
};

export default DocumentUpload;
