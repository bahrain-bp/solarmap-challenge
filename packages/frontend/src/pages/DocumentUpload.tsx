import React from "react";
import uploadImage from "../uploadImage";

type ListenFunction = (url: string) => void;

const DocumentUpload: React.FC<{ listen: ListenFunction }> = ({ listen }) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const imageInput = document.querySelector("#imageInput") as HTMLInputElement;
    const file = imageInput.files ? imageInput.files[0] : null;

    if (file) {
      try {
        const imageUrl = await uploadImage(file);

        // Call the listen function with the necessary parameter
        listen(imageUrl);

        // Display the uploaded image
        const img = document.createElement("img");
        img.src = imageUrl;
        document.body.appendChild(img);
      } catch (error) {
        // Handle error, e.g., show an error message to the user
      }
    }
  };

  return (
    <>
      <form id="imageForm" onSubmit={handleSubmit}>
        <input type="file" id="imageInput" accept="image/*"/>
        <button type="submit">Upload</button>
      </form>
    </>
  );
};

export default DocumentUpload;
