import { useState } from 'react';
import exportString from "../../api_url";

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

interface AddConsultantProps {
    onClose: () => void;
  }

const AddConsultant: React.FC<AddConsultantProps> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [level, setLevel] = useState('');
    const [crepNum, setCrepNum] = useState('');
    const [fax, setFax] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const validName = event.target.value.replace(/[^a-zA-Z\s]/g, ""); // Remove non-letters and non-spaces
        setName(validName);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const consultantData = JSON.stringify({
            name,
            level,
            crepNum,
            fax: fax ? parseInt(fax) : null,
            contactInfo
        });

        try {
            const response = await fetch(`${API_BASE_URL}/consultants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: consultantData
            });

            if (!response.ok) throw new Error('Failed to add consultant');

            setMessage('Consultant added successfully');
      setTimeout(() => {
        onClose(); // Close the modal on successful submit
      }, 1500); // Wait for 1.5 seconds before closing the modal
    } catch (error: any) {
      setMessage(error.message || 'Failed to add consultant');
    } finally {
      setIsLoading(false);
    }
  };

    return (
        <div className="container mt-3">
            <h2>Add Consultant</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" required value={name} onChange={handleNameChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="level" className="form-label">Level</label>
                    <select className="form-control" id="level" required value={level} onChange={e => setLevel(e.target.value)}>
                        <option value="">Select Level</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="crepNum" className="form-label">CREP Number</label>
                    <input type="text" className="form-control" id="crepNum" required value={crepNum} onChange={e => setCrepNum(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="fax" className="form-label">Fax Number</label>
                    <input type="text" className="form-control" id="fax" value={fax} onChange={e => setFax(e.target.value.replace(/[^0-9]/g, ""))} />
                </div>
                <div className="mb-3">
                    <label htmlFor="contactInfo" className="form-label">Contact Information</label>
                    <input type="text" className="form-control" id="contactInfo" value={contactInfo} onChange={e => setContactInfo(e.target.value.replace(/[^0-9]/g, ""))} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>Add Consultant</button>
            </form>
            {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
    );
};

export default AddConsultant;
