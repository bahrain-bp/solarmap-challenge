import React, { useState } from "react";
import uploadImage from "../uploadImage";

type ListenFunction = (url: string) => void;

const DocumentUpload: React.FC<{ listen: ListenFunction }> = ({ listen }) => {
    const [fileType, setFileType] = useState<"png" | "jpeg" | "pdf">("png"); // Default to PNG type

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFileType(event.target.value as "png" | "jpeg" | "pdf");
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
      
        const fileInput = document.querySelector("#formFileLg") as HTMLInputElement;
        const file = fileInput.files ? fileInput.files[0] : null;

        if (file) {
            try {
                let contentType = "";
                if (fileType === "png") {
                    contentType = "image/png";
                } else if (fileType === "jpeg") {
                    contentType = "image/jpeg";
                } else {
                    contentType = "application/pdf";
                }

                const fileUrl = await uploadImage(file, contentType);

                // Call the listen function with the necessary parameter
                listen(fileUrl);

                // Display the uploaded file
                const link = document.createElement("a");
                link.href = fileUrl;
                link.target = "_blank";
                link.innerText = "Uploaded File";
                document.body.appendChild(link);
            } catch (error) {
                // Handle error, e.g., show an error message to the user
            }
        }
    };

    return (
        <>
          <form id="fileForm" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="formFileLg" className="form-label">Select File Type:</label>
              <select className="form-select" value={fileType} onChange={handleTypeChange}>
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="formFileLg" className="form-label">Upload File:</label>
              <input className="form-control" id="formFileLg" type="file" accept={fileType === "pdf" ? ".pdf" : `image/${fileType}`} />
              <p>Acceptable files are *.pdf, *.png, and *.jpeg</p>
            </div>
            <button className="btn btn-primary" type="submit">Upload</button>
          </form>
        </>
    );
};

export default DocumentUpload;
