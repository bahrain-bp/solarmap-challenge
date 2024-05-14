import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import exportString from "../api_url";

const AdminMap = () => {
  const apiurl: string = exportString();
  const API_BASE_URL = apiurl;
  const [map, setMap] = useState<L.Map | null>(null);
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [panels, setPanels] = useState<number>(0);
  const [installationDate, setInstallationDate] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [clickCoordinates, setClickCoordinates] = useState<L.LatLng | null>(null);
  const [additionalPoints, setAdditionalPoints] = useState<{
    owner_name: string;
    installation_address: string;
    number_of_panel: number;
    installation_date: string;
    installation_coord: [number, number];
  }[]>([
    {
      owner_name: "Point 1",
      installation_address: "Location 1",
      installation_coord: [26.07, 50.55],
      number_of_panel: 25,
      installation_date: "2024-05-14" // Sample installation date
    },
    {
      owner_name: "Point 2",
      installation_address: "Location 2",
      installation_coord: [26.08, 50.56],
      number_of_panel: 15,
      installation_date: "2024-05-15" // Sample installation date
    }
  ]);
  const [mapClickable, setMapClickable] = useState<boolean>(false); // State to track if the map is clickable
  const [selectedPoint, setSelectedPoint] = useState<{
    name: string;
    panels: number;
  } | null>(null); // State to track the selected point

  useEffect(() => {
    const leafletMap = L.map('map').setView([26.0667, 50.5577], 10);
    setMap(leafletMap);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(leafletMap);

    return () => {
      leafletMap.remove();
    };
  }, []);

  useEffect(() => {
    if (map) {
      additionalPoints.forEach(point => {
        L.marker(point.installation_coord)
          .addTo(map)
          .bindPopup(`<b>${point.owner_name}</b><br>${point.number_of_panel} Panels`)
          .on('click', () => setSelectedPoint({ name: point.owner_name, panels: point.number_of_panel }));
      });
    }
  }, [additionalPoints, map]);

  useEffect(() => {
    if (map && clickCoordinates) {
      L.marker([clickCoordinates.lat, clickCoordinates.lng])
        .addTo(map)
        .openPopup();
      setShowForm(true); // Show the form when user clicks on the map
      setMapClickable(false); // Disable map click after selecting point
    }
  }, [clickCoordinates, map]);

  useEffect(() => {
    if (map && mapClickable) { // Check if map is clickable
      map.on('click', handleMapClick);
    }

    return () => {
      if (map) {
        map.off('click', handleMapClick);
      }
    };
  }, [map, mapClickable]);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    setClickCoordinates(e.latlng);
  };

  const handleFormSubmit = async () => {
    // Check if all required fields are filled
    if (name && address && panels && installationDate && clickCoordinates && map) {
      const newPoint = {
        owner_name: name,
        installation_address: address,
        number_of_panel: panels,
        installation_date: installationDate,
        installation_coord: [clickCoordinates.lat, clickCoordinates.lng] as [number, number]
      };
      
  
      try {
        const response = await fetch(`${API_BASE_URL}/solarpanel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newPoint)
        });
  
        if (!response.ok) {
          throw new Error('Failed to add solar panel point');
        }
  
        const responseData = await response.json();
        console.log('Solar panel point added successfully:', responseData);
  
        // Update the additionalPoints state with the newly added point
        setAdditionalPoints([...additionalPoints, newPoint]);
  
        // Reset form fields and state
        setName('');
        setAddress('');
        setPanels(0);
        setInstallationDate('');
        setShowForm(false);
        setClickCoordinates(null);
        setMapClickable(false); // Disable map click after submitting form
      } catch (error) {
        console.error('Error adding solar panel point:', error);
        alert('Failed to add solar panel point. Please try again.');
      }
    } else {
      // Handle the case where some fields are not filled
      alert('Please fill in all fields before adding a new point.');
    }
  };
  
  
  

  const handleDeletePoint = (index: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this point?");
    if (confirmed) {
      const updatedPoints = [...additionalPoints];
      updatedPoints.splice(index, 1);
      setAdditionalPoints(updatedPoints);
      if (map) {
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            const marker = layer as L.Marker;
            const markerLatLng = marker.getLatLng();
            if (
              markerLatLng.lat === additionalPoints[index].installation_coord[0] &&
              markerLatLng.lng === additionalPoints[index].installation_coord[1]
            ) {
              map.removeLayer(marker);
            }
          }
        });
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    if (clickCoordinates && map) {
      // Remove the marker from the map
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          const marker = layer as L.Marker;
          const markerLatLng = marker.getLatLng();
          if (
            markerLatLng.lat === clickCoordinates.lat &&
            markerLatLng.lng === clickCoordinates.lng
          ) {
            map.removeLayer(marker);
          }
        }
      });
    }
    setClickCoordinates(null); // Reset clickCoordinates to null when form is closed
    setMapClickable(false); // Disable map click again if form is closed
  };

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col">
          <div id="map" style={{ height: '600px', width: '100%', position: 'relative' }}>
            {mapClickable && (
              <div
                style={{
                  backgroundColor: 'green',
                  color: 'white',
                  padding: '10px',
                  position: 'absolute',
                  textAlign: 'center',
                  top: 0,
                  left: 0,
                  width: '100%',
                  zIndex: 999,
                }}
              >
                Click on a point on the map
              </div>
            )}
          </div>
          <Button onClick={() => setMapClickable(true)} style={{ marginTop: '10px' }}>Add Point</Button> {/* Allow user to enable map click */}
        </div>
      </div>
      <Modal show={showForm && clickCoordinates !== null} onHide={handleCloseForm}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Point</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label className="form-label">Name:</label>
              <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Address:</label>
              <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Panels:</label>
              <input type="number" className="form-control" value={panels} onChange={(e) => setPanels(parseInt(e.target.value))} />
            </div>
            <div className="mb-3">
              <label className="form-label">Installation Date:</label>
              <input type="date" className="form-control" value={installationDate} onChange={(e) => setInstallationDate(e.target.value)} />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseForm}>
            Close
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            Add Point
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="row mt-3">
        <div className="col">
          <h2>Additional Points</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Coordinates</th>
                <th>Panels</th>
                <th>Installation Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {additionalPoints.map((point, index) => (
                <tr key={index}>
                  <td>{point.owner_name}</td>
                  <td>{point.installation_address}</td>
                  <td>{point.installation_coord.join(', ')}</td> {/* Display coordinates */}
                  <td>{point.number_of_panel}</td>
                  <td>{point.installation_date}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDeletePoint(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedPoint && (
        <div className="row mt-3">
          <div className="col">
            <h2>Selected Point</h2>
            <p>Name: {selectedPoint.name}</p>
            <p>Panels: {selectedPoint.panels}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMap;
