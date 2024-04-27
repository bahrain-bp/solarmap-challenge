import { useState } from 'react';
import exportString from "../api_url";

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

const AddEducationalResource = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [resourceUrl, setResourceUrl] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        let resourceImgBase64 = null;
        if (image) {
            resourceImgBase64 = await convertToBase64(image);
        }

        const resourceData = JSON.stringify({
            title,
            body,
            resource_url: resourceUrl,
            resource_img: resourceImgBase64
        });

        try {
            const response = await fetch(`${API_BASE_URL}/resources`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: resourceData
            });

            if (!response.ok) throw new Error('Failed to upload resource');

            setMessage('Resource added successfully');
        } catch (error: any) {
            setMessage(error.message || 'Failed to add resource');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    return (
        <div className="container mt-3">
            <h2>Add Educational Resource</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" required value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="body" className="form-label">Body</label>
                    <textarea className="form-control" id="body" required value={body} onChange={e => setBody(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="resourceUrl" className="form-label">Resource URL</label>
                    <input type="url" className="form-control" id="resourceUrl" value={resourceUrl} onChange={e => setResourceUrl(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Resource Image</label>
                    <input type="file" className="form-control" id="image" accept="image/*" onChange={handleImageChange} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>Add Resource</button>
            </form>
            {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
    );
};

export default AddEducationalResource;
