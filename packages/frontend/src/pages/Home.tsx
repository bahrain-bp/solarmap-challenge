import * as React from 'react';
import SolarHero from '../modules/SolarHero';
import SolarValues from '../modules/SolarValues';
import SolarFeatures from '../modules/SolarFeatures';
import withRoot from '../withRoot';

function Home() {
  return (
    <React.Fragment>
      <SolarHero />
      <SolarValues />
      <SolarFeatures />
    </React.Fragment>
  );
}

export default withRoot(Home);