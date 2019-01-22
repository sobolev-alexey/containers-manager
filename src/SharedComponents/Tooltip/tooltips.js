import React from 'react';

export default [
  {
    // Step 0 - login page
    title: "Let's begin",
    content: (
      <div className="tooltip-content">
        Congratulations, you have just sold a full container load of coffee to a buyer in Singapore<br /><br />
        <span className="action">Log in as Shipper to prepare the shipment</span>
      </div>
    ),
    target: '.shipper-cta',
    placement: 'right'
  },
  {
    // Step 1 - list page
    content: (
      <div className="tooltip-content">
        As you can see there is already a list of containers moving around in the world, you need to announce a new container for the coffee to Singapore<br /><br />
        <span className="action">Click on create a new container</span>
      </div>
    ),
    target: '.create-new-cta',
    placement: 'right'
  },
  {
    // Step 2 - create new page
    content: (
      <div className="tooltip-content">
        In order to send your new container, you need to identify and log the container so it can be tracked accordingly.<br /><br />
        <span className="action">Name your container and complete the form to create a new shipment</span>
      </div>
    ),
    target: '.create-cta',
    placement: 'top'
  },
  {
    // Step 3 - details page
    content: (
      <div className="tooltip-content">
        A digital twin of the container is created on the Tangle and a MAM channel is opened, for recording the future events and journey of the container. This allows digital tracking including appending certifications, trade documents and supply chain events, written and accessible by authorised members of the supply chain. There is no need for papers and no risk of falsified information.<br /><br />
        <span className="action">Check Tangle to explore the data that has been uploaded to the IOTA Tangle</span>
      </div>
    ),
    target: '.tangle-tab',
    placement: 'bottom'
  },
  {
    // Step 4 - details page, tangle tab
    content: (
      <div className="tooltip-content">
        "Expand all" to see the data currently uploaded to Tangle and affiliated to the digital twin of this container.<br /><br />
        A unique MAM data stream has been generated to represent the container. All future events and data will be stored in this MAM channel - making the Tangle the trusted transaction layer between actors.<br /><br />
        <span className="action">Click on "Status" to go back</span>
      </div>
    ),
    target: '.md-switch-container',
    placement: 'right'
  },
  {
    // Step 5 - details page
    content: (
      <div className="tooltip-content">
        Your container has been registered. Do not forget to upload key trade documents. These are safely stored and travel digitally with your container twin.<br /><br />
        <span className="action">Go to the document tab</span>
      </div>
    ),
    target: '.documents-tab',
    placement: 'bottom'
  },
  {
    // Step 6 - details page, documents tab
    content: (
      <div className="tooltip-content">
        Start by adding any document format in pdf, jpg, or word. You will see your file securely and privately stored, associated with the digital container twin.<br /><br />
        <span className="action">Drag & Drop your files into the grey-ish area or browse them to append new document to this container</span>
      </div>
    ),
    target: '.filepond--wrapper',
    placement: 'top'
  },
  {
    // Step 7 - details page, documents tab
    content: (
      <div className="tooltip-content">
        Your documents have been uploaded and verified (checkmark symbol shown). You can check to see that your document has been registered on the tangle (TANGLE TAB) and when ready switch back to the dashboard of all containers.<br /><br />
        <span className="action">Click on the "Back" button to see list of all containers</span>
      </div>
    ),
    target: '.back-cta',
    placement: 'right'
  },
  {
    // Step 8 - list page
    content: (
      <div className="tooltip-content">
        You have announced the container for all actors to see and it is added to your list of containers. The list provides overview of all containers and their current status.<br /><br />
        Your container is ready to be moved to port. Change to a freight forwarder role to organise and complete this part of journey.<br /><br />
        <span className="action">Click on the "Log out" button</span>
      </div>
    ),
    target: '.header-cta-wrapper',
    placement: 'bottom'
  },
  {
    // Step 9 - login page
    content: (
      <div className="tooltip-content">
        Change to a freight forwarder role to manage logistics for moving container from shipper to port.<br /><br />
        <span className="action">Log in as freight forwarder to prepare the shipment</span>
      </div>
    ),
    target: '.forwarder-cta',
    placement: 'right'
  },
  {
    // Step 10 - list page
    content: (
      <div className="tooltip-content">
        As a freight forwarder, you have been contacted by shipper and informed that a container needs to be moved to the port.<br /><br />
        <span className="action">Select the container and proceed</span>
      </div>
    ),
    target: '.list-all',
    placement: 'top'
  },
  {
    // Step 11 - details page
    content: (
      <div className="tooltip-content">
        When the container is delivered at the port, as a freight forwarder you need to announce that it is Gate-in into the port area.<br /><br />
        <span className="action">Select the the button to confirm Gate-in</span>
      </div>
    ),
    target: '.gate-in',
    placement: 'bottom'
  },
  {
    // Step 12 - details page
    content: (
      <div className="tooltip-content">
        Gate-in has been confirmed. You can also check and upload documents to the shared container repository to give full insight (could be Certificate of Origin or the Phytosanitary certificate etc.) These will be accessible by authorized parties at all times.<br /><br />
        Once all documents have been uploaded or read, click on "Log out" to to change role and issue the customs clearance for export.<br /><br />
        <span className="action">Click on the "Log out" button</span>
      </div>
    ),
    target: '.header-cta-wrapper',
    placement: 'bottom'
  },
  {
    // Step 13 - login page
    content: (
      <div className="tooltip-content">
        <span className="action">Change to customs role</span>
      </div>
    ),
    target: '.customs-cta',
    placement: 'right'
  },
  {
    // Step 14 - list page
    content: (
      <div className="tooltip-content">
        As customs official, you only see the containers already processed or where the status is “Gate-in” and thus awaiting customs clearance for export.<br /><br />
        <span className="action">Select the container to proceed</span>
      </div>
    ),
    target: '.list-all',
    placement: 'top'
  },
  {
    // Step 15 - details page
    content: (
      <div className="tooltip-content">
        You have access to prior events for this shipment including uploaded documents, time-stamps for previous events etc. The Tangle serves as the Single-Version-of-Truth for all actors.<br /><br />
        <span className="action">Confirm the container is cleared for export</span>
      </div>
    ),
    target: '.container-cleared-for-export',
    placement: 'bottom'
  },
  {
    // Step 16 - details page
    content: (
      <div className="tooltip-content">
        Container cleared for export! Maybe you want to check the temperature?<br /><br />
        <span className="action">Go to the temperature tab</span>
      </div>
    ),
    target: '.temperature-tab',
    placement: 'bottom'
  },
  {
    // Step 17 - details page, temperature tab
    content: (
      <div className="tooltip-content">
        When the container was announced the temperature was logged in as 15° C. But in a live scenario it will be data from a smart sensor that continuously feed into the Tangle to ensure an auditable trace of conditions.<br /><br />
        <span className="action">To illustrate how data can continiously be added, this demo allow to manually add a new temperature value. Try to add 14° C</span>
      </div>
    ),
    target: '.detail-section-wrapper',
    placement: 'top'
  },
  {
    // Step 18 - details page
    content: (
      <div className="tooltip-content">
        An auditable trace of conditions are securely stored in the Tangle for all authorized actors to access. Given the time-stamps it is possible to link any temperature fluctuations to container status and chain-of-custody among actors.<br /><br />
        <span className="action">Click on the "Log out" button to proceed to last step</span>
      </div>
    ),
    target: '.header-cta-wrapper',
    placement: 'bottom'
  },
  {
    // Step 19 - login page
    content: (
      <div className="tooltip-content">
        <span className="action">Change to Port role to announce when the container is loaded on vessel.</span>
      </div>
    ),
    target: '.port-cta',
    placement: 'right'
  },
  {
    // Step 20 - list page
    content: (
      <div className="tooltip-content">
        <span className="action">Select the container to proceed</span>
      </div>
    ),
    target: '.list-all',
    placement: 'top'
  },
  {
    // Step 21 - details page
    content: (
      <div className="tooltip-content">
        The container is logged and ready to go: Step 1: Confirm that it is loaded onto vessel & step 2: Confirm when vessel has departed.<br /><br />
        <span className="action">Confirm the container is loaded onto vessel</span>
      </div>
    ),
    target: '.container-loaded-on-vessel',
    placement: 'bottom'
  },
  {
    // Step 22 - details page
    content: (
      <div className="tooltip-content">
        The container is loaded onto vessel.<br /><br />
        <span className="action">Confirm vessel departure</span>
      </div>
    ),
    target: '.vessel-departure',
    placement: 'bottom'
  },
  {
    // Step 23 - details page
    content: (
      <div className="tooltip-content">
        Vessel is on the way to the destination port. You can track location of the vessel.<br /><br />
        <span className="action">Go to the location tab</span>
      </div>
    ),
    target: '.location-tab',
    placement: 'bottom'
  },
  {
    // Step 24 - details page
    content: (
      <div className="tooltip-content">
        Congratulations! The shipment is on the way.<br /><br />
        <span className="action">Click on the "Log out" to complete the tour</span>
      </div>
    ),
    target: '.header-cta-wrapper',
    placement: 'bottom'
  }
];
