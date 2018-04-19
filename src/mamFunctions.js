import * as Mam from 'mam.client.js';
import IOTA from 'iota.lib.js'
import config from './config.json';
const iota = new IOTA({ provider: config.provider })

// Initialise MAM State
let mamState = Mam.init(iota)

// Set channel mode for default state
const defaultMamState = Mam.changeMode(
    mamState,
    'restricted',
    config.secretKey
)

// Publish to tangle
const publish = async data => {
    // Create MAM Payload - STRING OF TRYTES
    const trytes = iota.utils.toTrytes(JSON.stringify(data))
    const message = Mam.create(mamState, trytes)

    // Save new mamState
    updateMamState(message.state)

    // Attach the payload.
    await Mam.attach(message.payload, message.address)

    return { root: message.root, state: message.state }
}

const updateMamState = newMamState => (mamState = newMamState)

export const fetchChannel = async root => {
    const fetchResults = [];
    await Mam.fetch(
      root, 'restricted', config.secretKey,
      data => fetchResults.push(JSON.parse(iota.utils.fromTrytes(data)))
    )
    return fetchResults
}

export const createNewChannel = async payload => {
    updateMamState(defaultMamState)
    const mamData = await publish(payload)
    return mamData
}

export const appentToChannel = async (payload, savedMamData) => {
    const mamState = {
      subscribed: [],
      channel: {
        side_key: config.secretKey,
        mode: 'restricted',
        next_root: savedMamData.next,
        security: 2,
        start: savedMamData.start,
        count: 1,
        next_count: 1,
        index: 0
      },
      seed: savedMamData.seed
    }
    updateMamState(mamState)
    const mamData = await publish(payload)
    return mamData
}
