## Run

Install dependencies

```
cd functions
yarn
```

## Compile for older Node.js version

```
cd functions
node_modules/.bin/babel create_container.js --out-file generated/create_container.js
```

## Service account / Private key

To use Firebase cloud functions you need to generate a private key and save it in `functions/service_account.json`

Go to Firebase console of your project
https://console.firebase.google.com/project/container-tracking-simulation/settings/serviceaccounts/adminsdk
then press `GENERATE NEW PRIVATE KEY` button. This will produce a JSON file.

## Testing

To test this locally, run
`firebase functions:shell`

Then call a function with parameters
`login.post('/login').form( {username: 'user123', password: 'password123' })`

## CORS

See https://cloud.google.com/storage/docs/configuring-cors
You can also use the `gsutil cors` command to get the CORS configuration of a bucket:

```
gsutil cors get gs://container-tracking-simulation.appspot.com
```

Use the `gsutil cors` command to configure CORS on a bucket:

```
gsutil cors set firebase_storage.json gs://container-tracking-simulation.appspot.com
```
