import { sha256 } from 'js-sha256';
import axios from 'axios';

export const validateIntegrity = (path, metadata) => {
  const promise = new Promise((resolve, reject) => {
    try {
      axios
        .get(path, { responseType: 'blob' })
        .then(response => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(response.data);
          reader.onload = () => {
            const arrayBuffer = reader.result;
            const sha256Hash = sha256(arrayBuffer);
            resolve({ sha256Hash, size: response.data.size });
          };
        })
        .catch(error => {
          reject(error);
        });
    } catch (error) {
      return reject(error);
    }
  });

  return promise;
};
