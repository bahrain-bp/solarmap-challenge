import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import uploadFile from "../uploadFile";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ListenFunction = (url: string) => void;

const DocumentUpload: React.FC = () => {
  const [, setUploadedFileUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [canUpload, setCanUpload] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [parsedData, setParsedData] = useState<Record<string, any>>({});
  const [estimateData, setEstimateData] = useState<null | { estimatedPanels: number; estimatedCost: number; paybackPeriod: number }>(null);
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

    return { estimatedPanels, estimatedCost, paybackPeriod };
  };

  const data = {
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

  return (
    <>
      <form id="fileForm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <h4>To get accurate and precise solar panel installation results matching your needs</h4>
          <br />
          <label htmlFor="formFileLg" className="form-label">Upload Your MEWA Bill Document File:</label>
          <input className="form-control" id="formFileLg" type="file" accept=".pdf, .png, .jpeg" />
          <p style={{ fontSize: "12px" }}>Acceptable files are *.pdf, *.png, and *.jpeg</p>
        </div>
        <button className="btn btn-primary" type="submit" disabled={uploading || !canUpload}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      </form>
      <br />

      {isCalculating && (
        <div className="alert alert-info mt-3">
          <h4>Calculating... {progress}%</h4>
          <div className="progress">
            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {message && (
        <div className="alert alert-info mt-3">
          <h4>Received Data:</h4>
          <p>{message}</p>
        </div>
      )}

      {estimateData && (
        <div className="alert alert-info mt-3">
          <h4>Solar Calculations:</h4>
          <Bar data={data} />
        </div>
      )}
    </>
  );
};

export default DocumentUpload;
