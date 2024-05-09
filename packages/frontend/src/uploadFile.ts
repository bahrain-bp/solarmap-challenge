// uploadImage.ts
const uploadImage = async (file: File, contentType: string): Promise<string> => {
  try {
      const { url } = await fetch(import.meta.env.VITE_API_URL+"/upload", {
          method: "POST",
          body: JSON.stringify({ contentType }),
      }).then(res => res.json());
    
      await fetch(url, {
          method: "PUT",
          headers: {
              "Content-Type": contentType
          },
          body: file,
      });

      const fileUrl = url.split('?')[0];
      console.log(fileUrl);
      return fileUrl;
  } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Error uploading file");
  }
};

export default uploadImage;
