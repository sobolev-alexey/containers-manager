import React, { Component } from 'react';
import Joyride from 'react-joyride';
import { withCookies } from 'react-cookie';
import _get from 'lodash/get';
import _last from 'lodash/last';
import ErrorBoundary from '../ErrorBoundary';
import tooltips from './tooltips';
import '../../assets/scss/tooltip.scss';
import close from '../../assets/images/tooltip-close.svg';

class Tooltip extends Component {
  static defaultProps = {
    customTooltip: null,
    fetchComplete: null,
    activeTabIndex: null
  }

  state = {
    showMobileTooltip: false,
    closeFn: null,
    tooltips: tooltips.map(tooltip => ({ ...tooltip, disableBeacon: true }))
  };

  callback = ({ action, index }) => {
    console.log('callback', action);
    if (action === 'update') {
      this.setState({ showMobileTooltip: true })
    }

    if (action === 'close') {
      const newTooltips = this.state.tooltips;
      delete newTooltips[index].disableBeacon;
      this.setState({ tooltips: newTooltips, showMobileTooltip: false })
    }
  }

  extractContent = element => {
    const last = _last(_get(element, 'props.children'));
    return _get(last, 'props.children');
  }

  helpers = props => this.setState({ closeFn: props.close });

  stopTour = () => {
    if (this.state.closeFn) {
      this.state.closeFn();
    }
    this.setState({ showMobileTooltip: false })
  }

  render() {
    const { cookies, customTooltip, fetchComplete, activeTabIndex } = this.props;
    const stepIndex = Number(cookies.get('tourStep') || 0);
    const { showMobileTooltip } = this.state;
    console.log('Tour step', stepIndex);

    if (fetchComplete === false) {
      return null;
    }

    let run = true;
    if (stepIndex === 4 && activeTabIndex !== 1) {
      run = false;
    } else if (stepIndex === 7 && activeTabIndex !== 2) {
      run = false;
    } else if (stepIndex === 18 && activeTabIndex !== 3) {
      run = false;
    }

    return (
      <React.Fragment>
        {
          showMobileTooltip ? (
            <div className="mobile-tooltip" role="button" onClick={this.stopTour}>
              <div className="tooltip-content">
                <span className="tooltip-step">
                  Step {stepIndex + 1}
                </span>
                <span className="tooltip-action">
                  {this.extractContent(tooltips[stepIndex].content)}
                </span>
              </div>
              <img alt="close" src={close} className="tooltip-close" />
            </div>
          ) : null
        }
        <ErrorBoundary>
          <Joyride
            steps={customTooltip || this.state.tooltips}
            stepIndex={!customTooltip ? stepIndex : null}
            callback={this.callback}
            getHelpers={this.helpers}
            hideBackButton
            spotlightClicks
            run={run}
            disableOverlay={stepIndex === 7}
            styles={{
              options: {
                overlayColor: 'transparent',
                primaryColor: '#603f98',
                textColor: '#3f3f3f',
                zIndex: 1000,
              }
            }}
            floaterProps={{
              wrapperOptions: {
                offset: -22,
                placement: 'top',
                position: true,
            }
          }}
          />
        </ErrorBoundary>
      </React.Fragment>
    )
  }
}

export default withCookies(Tooltip);
