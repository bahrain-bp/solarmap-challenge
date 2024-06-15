import { Box, Typography, Tabs, Tab, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import React, { useEffect, useState } from 'react';
import solarprovider from '../assets/solarprovider.jpg';
import pattern from '../assets/pattern.png';

interface Calculation {
  calculation_id: number;
  number_of_panels: number;
  total_cost: number;
  roi_percentage: number;
  payback_period: number;
}

interface InquiryDetail {
  first_name: string;
  last_name: string;
  email: string;
  phone: number;
  inquiry_content: string;
  address: string;
}

interface Feedback {
  feedback_id: number;
  feedback_content: string;
}

const Reports = () => {
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [inquiryDetails, setInquiryDetails] = useState<InquiryDetail[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'calculations' | 'inquiries' | 'feedbacks'>('calculations');
  const [calculationSearch, setCalculationSearch] = useState('');
  const [inquirySearch, setInquirySearch] = useState('');
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryDetail | null>(null);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    const fetchCalculations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/postcalculation`);
        if (!response.ok) {
          throw new Error('Failed to fetch calculations');
        }
        const calcData = await response.json();
        setCalculations(calcData);
      } catch (error) {
        console.error('Error fetching calculations:', error);
      }
    };

    const fetchInquiries = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/inquirycustomer`);
        if (!response.ok) {
          throw new Error('Failed to fetch inquiries');
        }
        const inquiryData = await response.json();
        setInquiryDetails(inquiryData);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      }
    };

    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/feedback`);
        if (!response.ok) {
          throw new Error('Failed to fetch feedbacks');
        }
        const feedbackData = await response.json();
        setFeedbacks(feedbackData);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    Promise.all([fetchCalculations(), fetchInquiries(), fetchFeedbacks()]).then(() => {
      setIsLoading(false);
    });
  }, []);

  const handleCalculationSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setCalculationSearch(event.target.value);
    } catch (error) {
      console.error('Error handling calculation search:', error);
    }
  };

  const handleInquirySearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setInquirySearch(event.target.value);
    } catch (error) {
      console.error('Error handling inquiry search:', error);
    }
  };

  const handleFeedbackSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setFeedbackSearch(event.target.value);
    } catch (error) {
      console.error('Error handling feedback search:', error);
    }
  };

  const filterCalculations = (calculation: Calculation) => {
    try {
      return (
        calculation.calculation_id.toString().includes(calculationSearch) ||
        calculation.number_of_panels.toString().includes(calculationSearch) ||
        calculation.total_cost.toString().includes(calculationSearch) ||
        calculation.roi_percentage.toString().includes(calculationSearch) ||
        calculation.payback_period.toString().includes(calculationSearch)
      );
    } catch (error) {
      console.error('Error filtering calculations:', error);
      return false;
    }
  };

  const filterInquiries = (inquiry: InquiryDetail) => {
    try {
      return (
        inquiry.first_name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        inquiry.last_name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        inquiry.phone.toString().includes(inquirySearch) ||
        inquiry.inquiry_content.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        inquiry.address.toLowerCase().includes(inquirySearch.toLowerCase()) // Filter by address
      );
    } catch (error) {
      console.error('Error filtering inquiries:', error);
      return false;
    }
  };

  const filterFeedbacks = (feedback: Feedback) => {
    try {
      return feedback.feedback_content.toLowerCase().includes(feedbackSearch.toLowerCase());
    } catch (error) {
      console.error('Error filtering feedbacks:', error);
      return false;
    }
  };

  const totalCalculatorUsages = calculations.length;

  const handleInquiryClick = (inquiry: InquiryDetail) => {
    setSelectedInquiry(inquiry);
    setEmailTo(inquiry.email); // Populate emailTo field with the selected inquiry's email
  };

  const handleEmailSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailSubject(event.target.value);
  };

  const handleEmailBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEmailBody(event.target.value);
  };

  const handleSubmitEmail = async (event: React.FormEvent<HTMLFormElement> | undefined) => {
    if (event) {
      event.preventDefault(); // Prevent default form submission behavior
    }
    try {
      // Check if emailTo is empty
      if (!emailTo) {
        throw new Error('Email address is required.');
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: emailTo, body: emailBody, subject: emailSubject }), // Correct order of fields
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.result === 'OK') {
        setResponseMessage('Email sent successfully!');
      } else {
        setResponseMessage('Error sending email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setResponseMessage('An error occurred while sending the email.');
    }
  };

  return (
    <Box sx={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ position: 'relative', width: '100%', height: '300px', mb: 4, overflow: 'hidden' }}>
        <img
          src={solarprovider}
          alt="Solar Providers"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(70%) blur(3px)',
            marginBottom: '-5px',
            borderRadius: '0',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Reports
          </Typography>
          <Typography variant="h6">
            A list of all reports, click on an inquiry to email them a response.
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          background: `url(${pattern})`, // Use imported pattern as background
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: 8,
        }}
      >
        <div className="container" style={{ marginBottom: '20px' }}>
          <div className="row align-items-center" style={{ marginTop: '20px' }}>
            <div className="col-auto">
              <Tabs
                value={activeTab}
                onChange={(_event, newValue) => setActiveTab(newValue)}
                aria-label="simple tabs example"
              >
                <Tab label="Calculations" value="calculations" />
                <Tab label="Inquiries" value="inquiries" />
                <Tab label="Feedbacks" value="feedbacks" />
              </Tabs>
            </div>
            <div className="col-auto ml-auto">
              <Typography className="badge badge-info mr-2">
                Total Calculator Usages: {totalCalculatorUsages}
              </Typography>
              <TextField
                fullWidth
                placeholder="Search..."
                value={
                  activeTab === 'calculations'
                    ? calculationSearch
                    : activeTab === 'inquiries'
                      ? inquirySearch
                      : feedbackSearch
                }
                onChange={
                  activeTab === 'calculations'
                    ? handleCalculationSearchChange
                    : activeTab === 'inquiries'
                      ? handleInquirySearchChange
                      : handleFeedbackSearchChange
                }
                margin="normal"
                variant="outlined"
              />
            </div>
          </div>
          <div className="tab-content mt-2">
            {activeTab === 'calculations' && (
              <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <table className="table table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>Calculation ID</th>
                      <th>Number of Panels</th>
                      <th>Total Cost</th>
                      <th>ROI Percentage</th>
                      <th>Payback Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculations.filter(filterCalculations).map((calculation, index) => (
                      <tr key={index}>
                        <td>{calculation.calculation_id}</td>
                        <td>{calculation.number_of_panels}</td>
                        <td>{calculation.total_cost}</td>
                        <td>{calculation.roi_percentage}</td>
                        <td>{calculation.payback_period}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'inquiries' && (
              <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <table className="table table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Inquiry</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiryDetails.filter(filterInquiries).map((detail, index) => (
                      <tr key={index} onClick={() => handleInquiryClick(detail)} style={{ cursor: 'pointer' }}>
                        <td>{detail.first_name}</td>
                        <td>{detail.last_name}</td>
                        <td>{detail.email}</td>
                        <td>{detail.phone}</td>
                        <td>{detail.inquiry_content}</td>
                        <td>{detail.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'feedbacks' && (
              <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <table className="table table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>Feedback ID</th>
                      <th>Feedback Content</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.filter(filterFeedbacks).map((feedback, index) => (
                      <tr key={index}>
                        <td>{feedback.feedback_id}</td>
                        <td>{feedback.feedback_content}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Box>
      <Dialog open={!!selectedInquiry} onClose={() => setSelectedInquiry(null)}>
        <DialogTitle>Send Email</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitEmail}>
            <TextField
              fullWidth
              label="To"
              type="email"
              value={emailTo}
              InputProps={{ readOnly: true }}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Subject"
              value={emailSubject}
              onChange={handleEmailSubjectChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Body"
              value={emailBody}
              onChange={handleEmailBodyChange}
              required
              multiline
              rows={4}
              margin="normal"
            />
            <DialogActions>
              <Button onClick={() => setSelectedInquiry(null)} color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </DialogActions>
          </form>
          <Typography>{responseMessage}</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Reports;
