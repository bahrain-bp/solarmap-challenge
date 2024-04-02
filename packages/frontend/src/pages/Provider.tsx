import '/src/index.css'

type Provider = {
  name: string;
  level: string;
  crpepNumber: string;
  phone: string;
  fax: string;
};

const providers: Provider[] = [
  { name: 'Ansari Engineering Services', level: 'A', crpepNumber: 'BN/34', phone: '175545454', fax: '175354545' },
  { name: 'Bahrain Engineering Bureau', level: 'A', crpepNumber: 'BN/80', phone: '17545454', fax: '1725445445' },
];

const Providers = () => {
  return (
    <div>
      <h2 style={{ color: 'navy' }}>List of Enrolled LEVEL-A Solar PV Consultants</h2>
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
          {providers.map((provider, index) => (
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
    </div>
  );
};

export default Providers;
