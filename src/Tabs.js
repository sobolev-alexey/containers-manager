import React from 'react';
import { TabsContainer, Tabs, Tab } from 'react-md';
import StatusList from './StatusList';
import ContainerDocuments from './ContainerDocuments';
// import ContainerTemperature from './ContainerTemperature';
import './Tabs.css';

const ContainerTabs = ({ container, statuses }) => (
  <TabsContainer panelClassName="md-grid" className="tabsWrapper">
    <Tabs tabId="simple-tab" mobile={false}>
      <Tab label="Status">
        <StatusList statuses={statuses} />
      </Tab>
      <Tab label="Documents">
        <ContainerDocuments container={container} />
      </Tab>
    </Tabs>
  </TabsContainer>
);

export default ContainerTabs;
