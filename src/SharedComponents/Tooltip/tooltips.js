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
        In order to send your new container, you need to identify and log this so that it can be tracked accordingly.<br /><br />
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
        A digital twin of the container is created on the Tangle and a MAM channel is opened, for recording the future events and journey of the container. This allows digital tracking including appending certifications, trade documents and supply chain events, written and accessible by authorised members of the supply chain. No papers and no option to falsify information.<br /><br />
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
        "Expand all" to see the data current uploaded to Tangle and affiliated to the digital twin of this container.<br /><br />
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
        Your container has been registered. Don't forget to upload key trade documents. These are safely stored and travel digitally with your container twin.<br /><br />
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
    target: '.documents-tab',
    placement: 'left'
    // target: '.filepond--wrapper',
    // placement: 'top'
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
    target: '.logout-cta',
    placement: 'left'
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
    // Step 10 - list page
    content: (
      <div className="tooltip-content">
        As a freight forwarder, you have been contacted by shipper and informed that a container needs to be moved to the port.<br /><br />
        <span className="action">Select the container and proceed</span>
      </div>
    ),
    target: '.users-container',
    placement: 'right'
  },
  {
    // Step 11 - details page
    content: (
      <div className="tooltip-content">
        When the container is delivered at the port, you as a freight forwarder need to announce that it is Gate-in into the port area.<br /><br />
        <span className="action">Select the the button to confirm Gate-in</span>
      </div>
    ),
    target: '.gate-in-cta',
    placement: 'left'
  },
];
