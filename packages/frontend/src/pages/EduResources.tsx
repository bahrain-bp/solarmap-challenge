import React, { useState } from 'react';
import exportString from "../api_url";

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

const EducationalResources: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    resource_url: '',
    resource_img: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log('Submitting form data:', formData); // Log the data being submitted

    try {
      const response = await fetch(`${API_BASE_URL}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Response:', result); // Log the response

      if (response.ok) {
        setMessage(result.message);
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      console.error('Error submitting form data:', error); // Log any errors
      setMessage('Failed to add resource and send SMS');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="display-4">Add Educational Resource and Subscription</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label htmlFor="title">Resource Title:</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="body">Resource Body:</label>
          <textarea
            className="form-control"
            id="body"
            name="body"
            value={formData.body}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="resource_url">Resource URL:</label>
          <input
            type="url"
            className="form-control"
            id="resource_url"
            name="resource_url"
            value={formData.resource_url}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="resource_img">Resource Image (Base64):</label>
          <input
            type="text"
            className="form-control"
            id="resource_img"
            name="resource_img"
            value={formData.resource_img}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            className="form-control"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            className="form-control"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2">Submit</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default EducationalResources;
