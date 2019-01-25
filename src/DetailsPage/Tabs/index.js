import React, { PureComponent } from 'react';
import sizeMe from 'react-sizeme';
import { withCookies } from 'react-cookie';
import { TabsContainer, Tabs, Tab } from 'react-md';
import isEmpty from 'lodash/isEmpty';
import StatusList from '../Status';
import Documents from '../Documents';
import Temperature from '../Temperature';
import Explorer from '../Explorer';
import Location from '../Location';
import updateStep from '../../utils/cookie';
import '../../assets/scss/tabs.scss';

class ItemTabs extends PureComponent {
  state = {
    activeTabIndex: this.props.activeTabIndex,
  };

  static defaultProps = {
    activeTabIndex: 0,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ activeTabIndex: nextProps.activeTabIndex });
  }

  onTabChange = newActiveTabIndex => {
    this.setState({ activeTabIndex: newActiveTabIndex });
    this.props.onTabChange(newActiveTabIndex);
  };

  render() {
    const {
      cookies,
      item,
      statuses,
      itemEvents,
      size,
      locationTracking,
      documentStorage,
      temperatureChart,
      onUploadComplete,
      onAddTemperatureLocationCallback,
      fileUploadEnabled,
    } = this.props;
    const locations = itemEvents.filter(({ position }) => !isEmpty(position));
    const { activeTabIndex } = this.state;

    const components = [
      <StatusList statuses={statuses} />,
      <Explorer />,
      <Documents item={item} onUploadComplete={onUploadComplete} fileUploadEnabled={fileUploadEnabled} />,
      <Temperature data={itemEvents} callback={onAddTemperatureLocationCallback} />,
      <Location data={locations} callback={onAddTemperatureLocationCallback} />
    ]

    return (
      <div className="tabs-wrapper">
        <TabsContainer
          activeTabIndex={activeTabIndex}
          onTabChange={this.onTabChange}
        >
          <Tabs tabId="item-details" mobile={size.width <= 768}>
            <Tab label="Status" className="status-tab" onClick={() => updateStep(cookies, 7)} />
            <Tab label="Tangle" className="tangle-tab" onClick={() => updateStep(cookies, 5)} />
            {documentStorage ? (
              <Tab label="Documents" className="documents-tab" onClick={() => updateStep(cookies, 8)} />
            ) : null}
            {temperatureChart ? (
              <Tab label="Temperature" className="temperature-tab" />
            ) : null}
            {locationTracking && item.status === 'Vessel departure' ? (
              <Tab label="Location" className="location-tab" onClick={() => updateStep(cookies, 26)} />
              ) : null}
          </Tabs>
        </TabsContainer>
        { components[activeTabIndex] }
      </div>
    );
  }
}

export default sizeMe({ monitorHeight: false })(withCookies(ItemTabs));
