import React, { useState, useEffect } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Box, Container, Typography, Button, TextField, Alert, LinearProgress, Grid } from '@mui/material';
import uploadFile from "../uploadFile";
import pattern from '../assets/pattern.png';  // Update the import path as needed
import royal from '../../assets/Royal.jpg';      // Update the import path as needed

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

type ListenFunction = (url: string) => void;

const DocumentUpload: React.FC = () => {
  const [, setUploadedFileUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [canUpload, setCanUpload] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [, setParsedData] = useState<Record<string, any>>({});
  const [estimateData, setEstimateData] = useState<null | { estimatedPanels: number; estimatedCost: number; paybackPeriod: number; monthlySavings: number }>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Web Socket Connection
  useEffect(() => {
    const webSocketUrl = import.meta.env.VITE_WEB_SOCKET_API_KEY;
    console.log(webSocketUrl);

    const newSocket = new WebSocket(webSocketUrl);

    newSocket.addEventListener("open", (event) => {
      console.log("WebSocket connection opened:", event);
    });

    newSocket.addEventListener("message", (event) => {
      console.log("WebSocket received a message:", event.data);
      setMessage(event.data);
      parseMessage(event.data);
      setIsCalculating(false);
      setProgress(100); // set progress to 100% when calculation is done
    });

    newSocket.addEventListener("close", (event) => {
      console.log("WebSocket connection closed:", event);
    });

    newSocket.addEventListener("error", (event) => {
      console.error("WebSocket connection error:", event);
      setIsCalculating(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    let uploadTimer: NodeJS.Timeout;

    if (!canUpload) {
      uploadTimer = setTimeout(() => {
        setCanUpload(true);
      }, 60000);
    }

    return () => {
      clearTimeout(uploadTimer);
    };
  }, [canUpload]);

  useEffect(() => {
    if (isCalculating) {
      setProgress(0);
      const progressInterval = setInterval(() => {
        setProgress(prevProgress => (prevProgress >= 95 ? 95 : prevProgress + 1)); // cap at 95% until calculation is done
      }, 100);
      return () => clearInterval(progressInterval);
    }
  }, [isCalculating]);

  const handleListen: ListenFunction = (url) => {
    setUploadedFileUrl(url);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fileInput = document.querySelector("#formFileLg") as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    setErrorMessage("");
    setSuccessMessage("");
    setParsedData({});
    setEstimateData(null);
    setMessage("");

    if (canUpload && file) {
      setCanUpload(false);
      setUploading(true);
      setErrorMessage("");
      try {
        const fileType = file.type.split("/")[1];
        if (fileType !== "png" && fileType !== "jpeg" && fileType !== "pdf") {
          throw new Error("Invalid file type. Please select a PNG, JPEG, or PDF file.");
        }

        const fileUrl = await uploadFile(file, file.type);
        handleListen(fileUrl);
        setSuccessMessage("File uploaded successfully!");
        setUploading(false);
        setIsCalculating(true);
        setErrorMessage("");
      } catch (error) {
        console.error("Error uploading file:", error);
        setErrorMessage("An error occurred while uploading the file. Please try again later.");
        setUploading(false);
        setIsCalculating(false);
      }
    } else if (!file) {
      setErrorMessage("Please select a file to upload.");
    }
  };

  const parseMessage = (data: string) => {
    const parts = data.split(", ");
    const parsed: Record<string, any> = {};

    parts.forEach(part => {
      const [key, value] = part.split(": ");
      parsed[key.trim()] = value?.trim();
    });

    setParsedData(parsed);
    setEstimateData(estimateSolarPanel(parsed));
  };

  const estimateSolarPanel = (data: Record<string, any>) => {
    const usage = parseFloat(data['Usage']);
    const rate = parseFloat(data['Rate']);
    const maxPowerSupply = parseFloat(data['Maximum Electricity Power Supply']);

    // Assumption: each panel generates 300 watts (0.3 kW)
    const panelPower = 0.3; // in kW

    if (!usage || !rate || !maxPowerSupply) return null;

    const estimatedPanels = usage / (panelPower * 30); // assuming 30 days of sunlight
    const estimatedCost = estimatedPanels * (rate * 24 * 30); // assuming a cost rate per month

    // Assume monthly savings from solar panels
    const monthlySavings = usage * rate;

    // Calculate payback period (in months)
    const paybackPeriod = estimatedCost / monthlySavings;

    return { estimatedPanels, estimatedCost, paybackPeriod, monthlySavings };
  };

  const barData = {
    labels: ['Estimated Panels', 'Estimated Cost (BD)', 'Payback Period (Months)'],
    datasets: [
      {
        label: 'Solar Panel Estimate',
        data: estimateData ? [estimateData.estimatedPanels, estimateData.estimatedCost, estimateData.paybackPeriod] : [],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
    datasets: [
      {
        label: 'Monthly Savings (BD)',
        data: estimateData ? Array(12).fill(estimateData.monthlySavings) : [],
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const pieData = {
    labels: ['Estimated Panels', 'Estimated Cost (BD)', 'Payback Period (Months)'],
    datasets: [
      {
        label: 'Proportion of Estimates',
        data: estimateData ? [estimateData.estimatedPanels, estimateData.estimatedCost, estimateData.paybackPeriod] : [],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box
      sx={{
        background: `url(${pattern})`, // Use imported pattern as background
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: 8,
      }}
    >
      <Container component="section" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary' }}>
          Upload Your MEWA Bill Document
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'primary' }}>
          To get accurate and precise solar panel installation results matching your needs.
        </Typography>
        <form id="fileForm" onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              id="formFileLg"
              type="file"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: '.pdf, .png, .jpeg' }}
              helperText="Acceptable files are *.pdf, *.png, and *.jpeg"
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={uploading || !canUpload}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </form>
        {errorMessage && <Alert severity="error" sx={{ mt: 3 }}>{errorMessage}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mt: 3 }}>{successMessage}</Alert>}
        {isCalculating && (
          <Box sx={{ mt: 3 }}>
            <Alert severity="info">
              <Typography>Calculating... {progress}%</Typography>
              <LinearProgress variant="determinate" value={progress} />
            </Alert>
          </Box>
        )}
        {message && (
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography>Received Data:</Typography>
            <Typography>{message}</Typography>
          </Alert>
        )}
        {estimateData && (
          <Box sx={{ mt: 3 }}>
            <Alert severity="info">
              <Typography>Solar Calculations:</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ height: '400px' }}>
                    <Bar data={barData} options={{ maintainAspectRatio: false }} />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ height: '400px' }}>
                    <Line data={lineData} options={{ maintainAspectRatio: false }} />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ height: '400px' }}>
                    <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                  </Box>
                </Grid>
              </Grid>
            </Alert>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default DocumentUpload;
