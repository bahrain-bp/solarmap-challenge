import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

const AdminMap = () => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [address, setAddress] = useState<string>('');
  const [panels, setPanels] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [clickCoordinates, setClickCoordinates] = useState<L.LatLng | null>(null);
  const [additionalPoints, setAdditionalPoints] = useState<{
    name: string;
    address?: string;
    coordinates: [number, number];
    panels: number;
  }[]>([
    {
      name: "Point 1",
      address: "Location 1",
      coordinates: [26.07, 50.55],
      panels: 25
    },
    {
      name: "Point 2",
      address: "Location 2",
      coordinates: [26.08, 50.56],
      panels: 15
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
        L.marker(point.coordinates)
          .addTo(map)
          .bindPopup(`<b>${point.name}</b><br>${point.panels} Panels`)
          .on('click', () => setSelectedPoint({ name: point.name, panels: point.panels }));
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

  const handleFormSubmit = () => {
    if (address && panels && clickCoordinates && map) {
      const newPoint = {
        name: `Point ${additionalPoints.length + 1}`,
        address,
        panels: parseInt(panels),
        coordinates: [clickCoordinates.lat, clickCoordinates.lng] as [number, number]
      };
      setAdditionalPoints([...additionalPoints, newPoint]);

      setAddress('');
      setPanels('');
      setShowForm(false);
      setClickCoordinates(null);
      setMapClickable(false); // Disable map click after submitting form
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
              markerLatLng.lat === additionalPoints[index].coordinates[0] &&
              markerLatLng.lng === additionalPoints[index].coordinates[1]
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
              <label className="form-label">Address:</label>
              <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Panels:</label>
              <input type="text" className="form-control" value={panels} onChange={(e) => setPanels(e.target.value)} />
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {additionalPoints.map((point, index) => (
                <tr key={index}>
                  <td>{point.name}</td>
                  <td>{point.address}</td>
                  <td>{point.coordinates.join(', ')}</td> {/* Display coordinates */}
                  <td>{point.panels}</td>
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
            <p><strong>Name:</strong> {selectedPoint.name}</p>
            <p><strong>Panels:</strong> {selectedPoint.panels}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMap;
