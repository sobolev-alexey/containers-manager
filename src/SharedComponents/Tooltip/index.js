import React from 'react';
import Joyride from 'react-joyride';
import '../../assets/scss/tooltip.scss';

export default ({ run = true, tooltip }) => (
  <Joyride
    run={run}
    steps={tooltip}
    styles={{
      options: {
        primaryColor: '#603f98',
        textColor: '#3f3f3f',
        zIndex: 1000,
      }
    }}
  />
);
