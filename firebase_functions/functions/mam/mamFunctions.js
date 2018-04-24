const Mam = require('mam.client.js');
const IOTA = require('iota.lib.js');
const config = require('./config.json');
const iota = new IOTA({ provider: config.provider });

// Initialise MAM State
let mamState = Mam.init(iota);

// Set channel mode for default state
const defaultMamState = Mam.changeMode(mamState, 'restricted', config.secret_key);

// Publish to tangle
const publish = async data => {
  // Create MAM Payload - STRING OF TRYTES
  const trytes = iota.utils.toTrytes(JSON.stringify(data));
  const message = Mam.create(mamState, trytes);

  // Save new mamState
  updateMamState(message.state);

  // Attach the payload.
  await Mam.attach(message.payload, message.address);

  return { root: message.root, state: message.state };
};

const updateMamState = newMamState => (mamState = newMamState);

const fetch = async root => {
  const fetchResults = [];
  await Mam.fetch(root, 'restricted', config.secret_key, data =>
    fetchResults.push(JSON.parse(iota.utils.fromTrytes(data)))
  );
  return fetchResults;
};

const createNewChannel = async payload => {
  updateMamState(defaultMamState);
  const mamData = await publish(payload);
  return mamData;
};

const appentToChannel = async (payload, mamState) => {
  updateMamState(mamState);
  const mamData = await publish(payload);
  return mamData;
};

module.exports = {
  appentToChannel,
  createNewChannel,
  fetch,
};
