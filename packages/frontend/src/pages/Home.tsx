import * as React from 'react';
import SolarHero from '../modules/SolarHero';
import withRoot from '../withRoot';

function Home() {
  return (
    <React.Fragment>
      <SolarHero />
    </React.Fragment>
  );
}

export default withRoot(Home);