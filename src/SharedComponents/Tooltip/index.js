import React, { Component } from 'react';
import Joyride from 'react-joyride';
import { withCookies } from 'react-cookie';
import ErrorBoundary from '../ErrorBoundary';
import tooltips from './tooltips';
import '../../assets/scss/tooltip.scss';

class Tooltip extends Component {
  static defaultProps = {
    customTooltip: null,
    fetchComplete: null,
    activeTabIndex: null,
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

  // scrollIntoView = () => {
  //   const target = document.querySelector('html');
  //   target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // }

  render() {
    const { cookies, customTooltip, fetchComplete, activeTabIndex } = this.props;
    const stepIndex = Number(cookies.get('tourStep') || 0);
    console.log('Tour step', stepIndex);

    if (fetchComplete === false) {
      return null;
    }

    // if (fetchComplete !== null) {
    //   this.scrollIntoView();
    // }

    let run = true;
    if (stepIndex === 4 && activeTabIndex !== 1) {
      run = false;
    } else if (stepIndex === 6 && activeTabIndex !== 2) {
      run = false;
    } else if (stepIndex === 17 && activeTabIndex !== 3) {
      run = false;
    }

    return (
      <ErrorBoundary>
        <Joyride
          steps={customTooltip || this.state.tooltips}
          stepIndex={!customTooltip ? stepIndex : null}
          callback={this.removeAutostart}
          hideBackButton
          spotlightClicks
          run={run}
          disableOverlay={stepIndex === 6}
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
