import React from 'react';
import { TabsContainer, Tabs, Tab } from 'react-md';
import StatusList from './StatusList';
import ContainerDocuments from './ContainerDocuments';
import './Tabs.css';

const ContainerTabs = ({ container, statuses }) => (
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
    </Tabs>
  </TabsContainer>
);

export default ContainerTabs;
