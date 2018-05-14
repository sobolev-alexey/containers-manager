import React from 'react';
import sizeMe from 'react-sizeme';
import { TabsContainer, Tabs, Tab } from 'react-md';
import last from 'lodash-es/last';
import isEmpty from 'lodash-es/isEmpty';
import StatusList from '../Status';
import ContainerDocuments from '../Documents';
import ContainerTemperature from '../Temperature';
import ContainerLocation from '../Location';
import './styles.css';

const ContainerTabs = ({
  activeTabIndex,
  container,
  statuses,
  containerEvents,
  size,
  fetchComplete,
}) => {
  const locations = containerEvents.filter(({ position }) => !isEmpty(position));
  return (
    <TabsContainer className="tabsWrapper" activeTabIndex={activeTabIndex}>
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
};

ContainerTabs.defaultProps = {
  activeTabIndex: 0,
};

export default sizeMe({ monitorHeight: false })(ContainerTabs);
