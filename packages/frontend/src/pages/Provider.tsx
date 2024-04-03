import {useState} from 'react';
import '/src/index.css'; 

type Provider = {
  name: string;
  level: string;
  crpepNumber: string;
  phone: string;
  fax: string;
};

const allProviders: Provider[] = [
  { name: 'Ansari Engineering Services', level: 'A', crpepNumber: 'BN/34', phone: '175545454', fax: '175354545' },
  { name: 'Bahrain Engineering Bureau', level: 'A', crpepNumber: 'BN/80', phone: '17545454', fax: '1725445445' },
  { name: 'SJM Electromechanical Engineering Bureau', level: 'B', crpepNumber: 'BN/177', phone: '17382264', fax: '17382267' },
  { name: 'Sunergy Solar Panels W.L.L.', level: 'B', crpepNumber: 'BN/218', phone: '17536000', fax: '17536666' },
];

const Providers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  const filteredProviders = allProviders.filter(provider => {
    return (
      (filterLevel ? provider.level === filterLevel : true) &&
      provider.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const hasFilteredResults = filteredProviders.length > 0;
  const showLevelA = !filterLevel || filterLevel === 'A';
  const showLevelB = !filterLevel || filterLevel === 'B';

  return (
    <div>        
      <h1>Solar PV Consultants</h1>
      <p>
        This is a list of all solar PV consultants in Bahrain. You can search for a provider by name or filter by level.
      </p>                 
      <div className="search-and-filter">
        <input
          type="text"
          placeholder="Search for a provider..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <select
          onChange={(e) => setFilterLevel(e.target.value)}
          className="level-filter"
          defaultValue=""
        >
          <option value="">All Levels</option>
          <option value="A">Level A</option>
          <option value="B">Level B</option>
        </select>
      </div>
      
      {showLevelA && hasFilteredResults && (
        <>
          <h2>List of Enrolled LEVEL-A Solar PV Consultants</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Level</th>
                <th>CRPEP Number</th>
                <th>Phone</th>
                <th>Fax</th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.filter(p => p.level === 'A').map((provider, index) => (
                <tr key={index}>
                  <td>{provider.name}</td>
                  <td>{provider.level}</td>
                  <td>{provider.crpepNumber}</td>
                  <td>{provider.phone}</td>
                  <td>{provider.fax}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {showLevelB && hasFilteredResults && (
        <>
          <h2>List of Enrolled LEVEL-B Solar PV Consultants</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Level</th>
                <th>CRPEP Number</th>
                <th>Phone</th>
                <th>Fax</th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.filter(p => p.level === 'B').map((provider, index) => (
                <tr key={index}>
                  <td>{provider.name}</td>
                  <td>{provider.level}</td>
                  <td>{provider.crpepNumber}</td>
                  <td>{provider.phone}</td>
                  <td>{provider.fax}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Providers;
