import React from 'react';
import { TabsContainer, Tabs, Tab } from 'react-md';
import last from 'lodash-es/last';
import StatusList from './StatusList';
import ContainerDocuments from './ContainerDocuments';
import ContainerTemperature from './ContainerTemperature';
import ContainerLocation from './Map';
import './Tabs.css';

const ContainerTabs = ({ container, statuses, containerEvents }) => (
  <TabsContainer className="tabsWrapper">
    <Tabs tabId="simple-tab" mobile={false}>
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
      {containerEvents && last(containerEvents) ? (
        <Tab label="Location">
          <ContainerLocation data={containerEvents} />
        </Tab>
      ) : null}
    </Tabs>
  </TabsContainer>
);

export default ContainerTabs;
