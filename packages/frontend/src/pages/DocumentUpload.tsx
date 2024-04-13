// DocumentUploadWithParent.tsx
import React, { useState } from "react";
import uploadImage from "../uploadFile";

type ListenFunction = (url: string) => void;

const DocumentUploadWithParent: React.FC = () => {
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleListen: ListenFunction = (url) => {
    setUploadedFileUrl(url);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fileInput = document.querySelector("#formFileLg") as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    if (file) {
      try {
        // Extract file type from the file name or MIME type
        const fileType = file.type.split("/")[1]; // Extracting the file extension from the MIME type
        if (fileType !== "png" && fileType !== "jpeg" && fileType !== "pdf") {
          throw new Error("Invalid file type. Please select a PNG, JPEG, or PDF file.");
        }

        const fileUrl = await uploadImage(file, file.type);

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
          <label htmlFor="formFileLg" className="form-label">Upload File:</label>
          <input className="form-control" id="formFileLg" type="file" accept=".pdf, .png, .jpeg" />
          <p>Acceptable files are *.pdf, *.png, and *.jpeg</p>
        </div>
        <button className="btn btn-primary" type="submit">Upload</button>
        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
      </form>
    </>
  );
};

export default DocumentUploadWithParent;
