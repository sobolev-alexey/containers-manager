import React, { PureComponent } from 'react';
import sizeMe from 'react-sizeme';
import { TabsContainer, Tabs, Tab } from 'react-md';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import StatusList from '../Status';
import Documents from '../Documents';
import Temperature from '../Temperature';
import Explorer from '../Explorer';
import Location from '../Location';
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
      item,
      statuses,
      itemEvents,
      size,
      fetchComplete,
      locationTracking,
      documentStorage,
      temperatureChart,
      onUploadComplete,
      onAddTemperatureLocationCallback,
      fileUploadEnabled,
      updateTooltipStep,
    } = this.props;
    const locations = itemEvents.filter(({ position }) => !isEmpty(position));

    return (
      <TabsContainer
        className="tabsWrapper"
        activeTabIndex={this.state.activeTabIndex}
        onTabChange={this.onTabChange}
      >
        <Tabs tabId="item-details" mobile={size.width <= 768}>
          <Tab label="Status" onClick={() => updateTooltipStep(5)}>
            <StatusList statuses={statuses} />
          </Tab>
          <Tab label="Tangle" className="tangle-tab" onClick={() => updateTooltipStep(4)}>
            <Explorer />
          </Tab>
          {documentStorage ? (
            <Tab label="Documents" className="documents-tab" onClick={() => updateTooltipStep(6)}>
              <Documents
                item={item}
                onUploadComplete={onUploadComplete}
                fileUploadEnabled={fileUploadEnabled}
              />
            </Tab>
          ) : null}
          {temperatureChart ? (
            <Tab label="Temperature">
              <Temperature data={itemEvents} callback={onAddTemperatureLocationCallback} />
            </Tab>
          ) : null}
          {
            locationTracking &&
            fetchComplete &&
            itemEvents &&
            last(itemEvents) &&
            locations.length > 0 ? (
              <Tab label="Location">
                <Location data={locations} callback={onAddTemperatureLocationCallback} />
              </Tab>
            ) : null
          }
        </Tabs>
      </TabsContainer>
    );
  }
}

export default sizeMe({ monitorHeight: false })(ItemTabs);
