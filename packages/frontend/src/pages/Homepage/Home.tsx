import * as React from 'react';
import SolarHero from './SolarHero';
import SolarValues from './SolarValues';
import SolarFeatures from './SolarFeatures';
import withRoot from '../../withRoot';
import SolarGetInTouch from './SolarGetInTouch';

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