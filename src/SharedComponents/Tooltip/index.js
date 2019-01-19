import React from 'react';
import Joyride from 'react-joyride';
import { withCookies } from 'react-cookie';
import tooltips from './tooltips';
import '../../assets/scss/tooltip.scss';

const Tooltip = ({ cookies, customTooltip = null }) => {
  const stepIndex = Number(cookies.get('tourStep') || 0);
  console.log('Tour step', stepIndex);
  
  return (
    <Joyride
      steps={customTooltip || tooltips}
      stepIndex={!customTooltip ? stepIndex : null}
      hideBackButton
      styles={{
        options: {
          primaryColor: '#603f98',
          textColor: '#3f3f3f',
          zIndex: 1000,
        }
      }}
    />
  );
}

export default withCookies(Tooltip);
