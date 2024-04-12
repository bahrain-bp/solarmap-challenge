const uploadImage = async (file: File): Promise<string> => {
    //const formData = new FormData();
    //formData.append("file", file);
  
    try {
      // Get secure URL from the server
      const { url } = await fetch("https://4fa2gsnj8b.execute-api.us-east-1.amazonaws.com/upload", {
        method: "POST",
        //body: formData,
      }).then(res => res.json());
      
      // Post the image directly to the S3 bucket
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "image/*" // or "application/octet-stream"
        },
        body: file
      });
  
      // Extract the image URL without query parameters
      const imageUrl = url.split('?')[0];
      console.log(imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Error uploading image");
    }
  };
  
  export default uploadImage;
  