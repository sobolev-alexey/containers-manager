import React from 'react';
import sizeMe from 'react-sizeme';
import { TabsContainer, Tabs, Tab } from 'react-md';
import last from 'lodash-es/last';
import isEmpty from 'lodash-es/isEmpty';
import StatusList from './StatusList';
import ContainerDocuments from './ContainerDocuments';
import ContainerTemperature from './ContainerTemperature';
import ContainerLocation from './Map';
import './Tabs.css';

const ContainerTabs = ({ container, statuses, containerEvents, size }) => {
  const locations = containerEvents.filter(({ position }) => !isEmpty(position));
  return (
    <TabsContainer className="tabsWrapper">
      <Tabs tabId="simple-tab" mobile={size.width <= 768}>
        <Tab label="Status">
          <StatusList statuses={statuses} />
        </Tab>
        {container.documents && container.documents.length > 0 ? (
          <Tab label="Documents">
            { console.log('Mobile', size.width) }
            <ContainerDocuments container={container} />
          </Tab>
        ) : null}
        {containerEvents && last(containerEvents) && last(containerEvents).temperature ? (
          <Tab label="Temperature">
            <ContainerTemperature data={containerEvents} />
          </Tab>
        ) : null}
        {containerEvents && last(containerEvents) && locations.length > 0 ? (
          <Tab label="Location">
            <ContainerLocation data={locations} />
          </Tab>
        ) : null}
      </Tabs>
    </TabsContainer>
  );
}

export default sizeMe({ monitorHeight: false })(ContainerTabs);
