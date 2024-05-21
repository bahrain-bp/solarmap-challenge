import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import exportString from "../api_url";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/images/marker-icon-2x.png";

const apiurl: string = exportString();
const API_BASE_URL = apiurl;

const AdminMap = () => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [panels, setPanels] = useState<number>(0);
  const [installationDate, setInstallationDate] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [clickCoordinates, setClickCoordinates] = useState<L.LatLng | null>(null);
  const [additionalPoints, setAdditionalPoints] = useState<{
    [x: string]: any;
    owner_name: string;
    installation_address: string;
    number_of_panel: number;
    installation_date: string;
    latitude: number;
    longitude: number;
    editMode: boolean;
  }[]>([]);
  const [mapClickable, setMapClickable] = useState<boolean>(false);
  const handleTableRowClick = (point: any) => {
    if (map) {
      map.setView([point.latitude, point.longitude], 15);
    }
  };
  

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
    const fetchSolarPanels = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/solarpanel`);
        if (!response.ok) {
          throw new Error('Failed to fetch solar panel data');
        }
        const data = await response.json();
        setAdditionalPoints(data.map((item: any) => ({ ...item, editMode: false })));
      } catch (error) {
        console.error('Error fetching solar panel data:', error);
      }
    };

    fetchSolarPanels();
  }, []);

  useEffect(() => {
    if (map && additionalPoints.length > 0) {
      additionalPoints.forEach(point => {
        L.marker([point.latitude, point.longitude])
          .addTo(map)
          .bindPopup(`
            <b>Name:</b> ${point.owner_name}<br/>
            <b>Address:</b> ${point.installation_address}<br/>
            <b>Panels:</b> ${point.number_of_panel}<br/>
            <b>Installation Date:</b> ${point.installation_date}
          `);
      });
    }
  }, [map, additionalPoints]);

  useEffect(() => {
    if (map && clickCoordinates) {
      L.marker([clickCoordinates.lat, clickCoordinates.lng])
        .addTo(map)
        .openPopup();
      setShowForm(true);
      setMapClickable(false);
    }
  }, [clickCoordinates, map]);

  useEffect(() => {
    if (map && mapClickable) {
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
    if (name && address && panels && installationDate && clickCoordinates && map) {
      const newPoint = {
        owner_name: name,
        installation_address: address,
        number_of_panel: panels,
        installation_date: installationDate,
        latitude: clickCoordinates.lat,
        longitude: clickCoordinates.lng
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
  
        setAdditionalPoints([...additionalPoints, { ...newPoint, editMode: false }]);
  
        setName('');
        setAddress('');
        setPanels(0);
        setInstallationDate('');
        setShowForm(false);
        setClickCoordinates(null);
        setMapClickable(false);
      } catch (error) {
        console.error('Error adding solar panel point:', error);
        alert('Failed to add solar panel point. Please try again.');
      }
    } else {
      alert('Please fill in all fields and select a point on the map before adding a new point.');
    }
  };

  const handleDeletePoint = async (index: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this point?");
    if (confirmed) {
      try {
        const solarPanelIdToDelete = additionalPoints[index].solarpanel_id;
        const response = await fetch(`${API_BASE_URL}/solarpanel/${solarPanelIdToDelete}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete solar panel point');
        }
  
        const responseData = await response.json();
        console.log('Solar panel point deleted successfully:', responseData);
  
        const updatedPoints = [...additionalPoints];
        updatedPoints.splice(index, 1);
        setAdditionalPoints(updatedPoints);
  
        if (map) {
          map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
              const marker = layer as L.Marker;
              const markerLatLng = marker.getLatLng();
              if (
                markerLatLng.lat === additionalPoints[index].latitude &&
                markerLatLng.lng === additionalPoints[index].longitude
              ) {
                map.removeLayer(marker);
              }
            }
          });
        }
      } catch (error) {
        console.error('Error deleting solar panel point:', error);
        alert('Failed to delete solar panel point. Please try again.');
      }
    }
  };

  const handleEditPoint = (index: number) => {
    const updatedPoints = [...additionalPoints];
    updatedPoints[index].editMode = true;
    setAdditionalPoints(updatedPoints);
  };

  const handleSaveEdit = async (index: number) => {
    try {
      const solarPanelIdToUpdate = additionalPoints[index].solarpanel_id;
      const response = await fetch(`${API_BASE_URL}/solarpanel/${solarPanelIdToUpdate}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(additionalPoints[index])
      });

      if (!response.ok) {
        throw new Error('Failed to update solar panel point');
      }

      const responseData = await response.json();
      console.log('Solar panel point updated successfully:', responseData);

      const updatedPoints = [...additionalPoints];
      updatedPoints[index].editMode = false;
      setAdditionalPoints(updatedPoints);
    } catch (error) {
      console.error('Error updating solar panel point:', error);
      alert('Failed to update solar panel point. Please try again.');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    if (clickCoordinates && map) {
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
    setClickCoordinates(null);
    setMapClickable(false);
  };

  // Insights calculation
  const totalPanels = additionalPoints.reduce((sum, point) => sum + point.number_of_panel, 0);
  const averagePanels = additionalPoints.length > 0 ? (totalPanels / additionalPoints.length).toFixed(2) : 0;
  const totalInstallations = additionalPoints.length;
  const earliestInstallation = additionalPoints.length > 0 ? new Date(Math.min(...additionalPoints.map(point => new Date(point.installation_date).getTime()))).toLocaleDateString() : 'N/A';
  const latestInstallation = additionalPoints.length > 0 ? new Date(Math.max(...additionalPoints.map(point => new Date(point.installation_date).getTime()))).toLocaleDateString() : 'N/A';

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
          <Button onClick={() => setMapClickable(true)} style={{ marginTop: '10px' }}>Add Point</Button>
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
          <h2>All Installations</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Panels</th>
                <th>Installation Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {additionalPoints.map((point, index) => (
                <tr key={index} onClick={() => handleTableRowClick(point)}>
                  <td>
                    {point.editMode ? (
                      <input
                        type="text"
                        value={point.owner_name}
                        onChange={(e) => {
                          const updatedPoints = [...additionalPoints];
                          updatedPoints[index].owner_name = e.target.value;
                          setAdditionalPoints(updatedPoints);
                        }}
                      />
                    ) : (
                      point.owner_name
                    )}
                  </td>
                  <td>
                    {point.editMode ? (
                      <input
                        type="text"
                        value={point.installation_address}
                        onChange={(e) => {
                          const updatedPoints = [...additionalPoints];
                          updatedPoints[index].installation_address = e.target.value;
                          setAdditionalPoints(updatedPoints);
                        }}
                      />
                    ) : (
                      point.installation_address
                    )}
                  </td>
                  <td>{point.latitude}</td>
                  <td>{point.longitude}</td>
                  <td>
                    {point.editMode ? (
                      <input
                        type="number"
                        value={point.number_of_panel}
                        onChange={(e) => {
                          const updatedPoints = [...additionalPoints];
                          updatedPoints[index].number_of_panel = parseInt(e.target.value);
                          setAdditionalPoints(updatedPoints);
                        }}
                      />
                    ) : (
                      point.number_of_panel
                    )}
                  </td>
                  <td>
                    {point.editMode ? (
                      <input
                        type="date"
                        value={point.installation_date}
                        onChange={(e) => {
                          const updatedPoints = [...additionalPoints];
                          updatedPoints[index].installation_date = e.target.value;
                          setAdditionalPoints(updatedPoints);
                        }}
                      />
                    ) : (
                      point.installation_date
                    )}
                  </td>
                  <td>
                    {point.editMode ? (
                      <Button
                        variant="success"
                        onClick={() => handleSaveEdit(index)}
                        disabled={!point.owner_name || !point.installation_address || !point.number_of_panel || !point.installation_date}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button variant="warning" onClick={() => handleEditPoint(index)} disabled={point.editMode}>
                        Edit
                      </Button>
                    )}
                    <Button className="mx-2" variant="danger" onClick={() => handleDeletePoint(index)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Insights Table */}
      <div className="row mt-3">
        <div className="col">
          <h2>Insights</h2>
          <table className="table">
            <tbody>
              <tr>
                <td>Total Panels</td>
                <td>{totalPanels}</td>
              </tr>
              <tr>
                <td>Average Panels per Installation</td>
                <td>{averagePanels}</td>
              </tr>
              <tr>
                <td>Total Installations</td>
                <td>{totalInstallations}</td>
              </tr>
              <tr>
                <td>Earliest Installation Date</td>
                <td>{earliestInstallation}</td>
              </tr>
              <tr>
                <td>Latest Installation Date</td>
                <td>{latestInstallation}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMap;


