import { useState } from "react";
import exportString from "../api_url";

const Inquiry = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const API_BASE_URL = exportString();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const combinedData = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone: parseInt(phone), // Ensure the phone is sent as a number
      inquiry_content: message
    };

    try {
      // Insert into the customer and inquiry tables
      const response = await fetch(`${API_BASE_URL}/inquirycustomer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(combinedData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to submit data');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="container mt-5">
      {submitted ? (
        <div>
          <h1>Thank You!</h1>
          <p>An EWA representative will reach out to you within 3-5 business days.</p>
        </div>
      ) : (
        <div>
          <h1>Inquire Further</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                className="form-control"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Inquiry;
