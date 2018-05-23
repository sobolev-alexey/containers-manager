import React, { PureComponent } from 'react';
import sizeMe from 'react-sizeme';
import { TabsContainer, Tabs, Tab } from 'react-md';
import { isEmpty, last } from 'lodash';
import StatusList from '../Status';
import ContainerDocuments from '../Documents';
import ContainerTemperature from '../Temperature';
import ContainerLocation from '../Location';
import './styles.scss';

class ContainerTabs extends PureComponent {
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
  };

  render() {
    const { container, statuses, containerEvents, size, fetchComplete } = this.props;
    const locations = containerEvents.filter(({ position }) => !isEmpty(position));

    return (
      <TabsContainer
        className="tabsWrapper"
        activeTabIndex={this.state.activeTabIndex}
        onTabChange={this.onTabChange}
      >
        <Tabs tabId="container-details" mobile={size.width <= 768}>
          <Tab label="Status">
            <StatusList statuses={statuses} />
          </Tab>
          {container.documents && container.documents.length > 0 ? (
            <Tab label="Documents">
              <ContainerDocuments container={container} />
            </Tab>
          ) : null}
          {containerEvents && last(containerEvents) && last(containerEvents).temperature ? (
            <Tab label="Temperature">
              <ContainerTemperature data={containerEvents} />
            </Tab>
          ) : null}
          {fetchComplete && containerEvents && last(containerEvents) && locations.length > 0 ? (
            <Tab label="Location">
              <ContainerLocation data={locations} />
            </Tab>
          ) : null}
        </Tabs>
      </TabsContainer>
    );
  }
}

export default sizeMe({ monitorHeight: false })(ContainerTabs);
