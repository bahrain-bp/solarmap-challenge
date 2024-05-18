import * as React from 'react';
import SolarHero from '../modules/SolarHero';
import SolarValues from '../modules/SolarValues';
import SolarFeatures from '../modules/SolarFeatures';
import withRoot from '../withRoot';
import SolarGetInTouch from '../modules/SolarGetInTouch';

function Home() {
  return (
    <React.Fragment>
      <SolarHero />
      <SolarValues />
      <SolarFeatures />
      <SolarGetInTouch />
    </React.Fragment>
  );
}

export default withRoot(Home);