import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const AdminMap = () => {
  useEffect(() => {
    // Initialize map
    const map = L.map('map').setView([26.0667, 50.5577], 10);

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Additional points
    const additionalPoints = [
      {
        name: "Point 1",
        coordinates: [26.07, 50.55],
        panels: 25
      },
      {
        name: "Point 2",
        coordinates: [26.08, 50.56],
        panels: 15
      }
    ];

    // Add markers for additional points
    additionalPoints.forEach(point => {
      const marker = L.marker([point.coordinates[0], point.coordinates[1]]).addTo(map);
      marker.bindPopup(`Panels Installed: ${point.panels}`).openPopup(); // Set popup content to include the number of panels
    });

    // Cleanup function
    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ height: '600px', width: '100%' }}></div>;
};

export default AdminMap;
