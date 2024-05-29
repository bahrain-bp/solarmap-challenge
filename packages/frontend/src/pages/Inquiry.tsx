import { useState } from "react";
import exportString from "../api_url";
import CalculationRec from '../components/CalculationRec';
import CircularProgress from '@mui/material/CircularProgress';

const Inquiry = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [showResults, setShowResults] = useState(false); // This will control the display of the CalculationRec component
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false); // State to manage loading indicator
  const API_BASE_URL = exportString();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone: string) => {
    const re = /^\d{8}$/;
    return re.test(phone);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName) newErrors.firstName = "First Name is required";
    if (!lastName) newErrors.lastName = "Last Name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Phone number must be 8 digits";
    }
    if (!message) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true); // Show loading indicator

    const combinedData = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone: parseInt(phone, 10), // Ensure the phone is sent as a number
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
        setShowResults(true);  // If the submission is successful, show the CalculationRec component
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to submit data');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  if (showResults) {
    // Show the CalculationRec component after successful submission
    return <CalculationRec />;
  }

  return (
    <div className="container mt-5">
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
          {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
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
          {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
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
          {errors.email && <small className="text-danger">{errors.email}</small>}
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
          {errors.phone && <small className="text-danger">{errors.phone}</small>}
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
          {errors.message && <small className="text-danger">{errors.message}</small>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          Submit
        </button>
        {loading && <CircularProgress className="ml-2" />} {/* Show loading indicator */}
      </form>
    </div>
  );
};

export default Inquiry;
