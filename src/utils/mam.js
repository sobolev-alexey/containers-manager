import Mam from 'mam.client.js';
import IOTA from 'iota.lib.js';
import { isEmpty, uniqBy, pick, find, last } from 'lodash';
import { createNewChannel, appendToChannel } from './mamFunctions';
import { createContainer, updateContainer } from './firebase';

const iota = new IOTA();

export const fetchContainer = async (root, secretKey, storeContainerCallback, setStateCalback) => {
  const containerEvents = [];
  await Mam.fetch(root, 'restricted', secretKey, data => {
    const containerEvent = JSON.parse(iota.utils.fromTrytes(data));
    storeContainerCallback(containerEvent);
    containerEvents.push(containerEvent);
    setStateCalback(containerEvent, getUniqueStatuses(containerEvents));
  });

  return containerEvents[containerEvents.length - 1];
};

const getUniqueStatuses = containerEvents =>
  uniqBy(containerEvents.map(event => pick(event, ['status', 'timestamp'])), 'status');

export const createContainerChannel = (containerId, request, secretKey) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const { departure, destination, load, type, shipper, status } = request;
      const timestamp = Date.now();
      const eventBody = {
        containerId,
        departure,
        destination,
        load,
        shipper,
        type,
        timestamp,
        status,
        temperature: null,
        position: null,
        documents: [],
      };

      const channel = await createNewChannel(eventBody, secretKey);

      if (channel && !isEmpty(channel)) {
        // Create a new container entry using that container ID
        await createContainer(eventBody, channel);
      }

      return resolve(eventBody);
    } catch (error) {
      console.log('createContainerChannel error', error);
      return reject();
    }
  });

  return promise;
};

export const appendContainerChannel = async (metadata, props, documentExists) => {
  const meta = metadata.length;
  const { auth, container, containers, match: { params: { containerId } } } = props;
  const { mam } = find(containers, { containerId });

  const promise = new Promise(async (resolve, reject) => {
    try {
      if (container) {
        const timestamp = Date.now();
        const {
          containerId,
          departure,
          destination,
          lastPositionIndex = 0,
          load,
          position = null,
          shipper,
          type,
          status,
          temperature,
          documents = [],
        } = last(container);
        const newStatus = meta
          ? status
          : auth.nextEvents[status.toLowerCase().replace(/[- ]/g, '')];

        metadata.forEach(({ name }) => {
          documents.forEach(existingDocument => {
            if (existingDocument.name === name) {
              reject(documentExists(name));
            }
          });
        });

        const newDocuments = [...documents, ...metadata];

        const newContainerData = await appendToChannel(
          {
            containerId,
            departure,
            destination,
            lastPositionIndex,
            load,
            position,
            shipper,
            type,
            timestamp,
            temperature,
            status: newStatus,
            documents: newDocuments,
          },
          mam,
          auth.mam.secret_key
        );

        if (newContainerData && !isEmpty(newContainerData)) {
          const eventBody = {
            containerId,
            timestamp,
            departure,
            destination,
            shipper,
            status: newStatus,
          };

          await updateContainer(eventBody, mam.root, newContainerData);

          return resolve(containerId);
        }
      }
      return reject();
    } catch (error) {
      return reject();
    }
  });

  return promise;
};
