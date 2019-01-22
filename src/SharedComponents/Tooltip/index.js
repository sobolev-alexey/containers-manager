import React, { Component } from 'react';
import Joyride from 'react-joyride';
import { withCookies } from 'react-cookie';
import ErrorBoundary from '../ErrorBoundary';
import tooltips from './tooltips';
import '../../assets/scss/tooltip.scss';

class Tooltip extends Component {
  static defaultProps = {
    customTooltip: null,
    fetchComplete: null
  }

  state = {
    tooltips: tooltips.map(tooltip => ({ ...tooltip, disableBeacon: true }))
  };

  removeAutostart = ({ action, index }) => {
    if (action === 'close') {
      const newTooltips = this.state.tooltips;
      delete newTooltips[index].disableBeacon;
      this.setState({ tooltips: newTooltips })
    }
  }

  render() {
    const { cookies, customTooltip, fetchComplete } = this.props;
    const stepIndex = Number(cookies.get('tourStep') || 0);
    console.log('Tour step', stepIndex);

    if (fetchComplete === false) {
      return null;
    }

    return (
      <ErrorBoundary>
        <Joyride
          steps={customTooltip || this.state.tooltips}
          stepIndex={!customTooltip ? stepIndex : null}
          callback={this.removeAutostart}
          hideBackButton
          spotlightClicks
          styles={{
            options: {
              overlayColor: 'transparent',
              primaryColor: '#603f98',
              textColor: '#3f3f3f',
              zIndex: 1000,
            }
          }}
        />
      </ErrorBoundary>
    )
  }
}

export default withCookies(Tooltip);
