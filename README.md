## Installation

1.  Clone/download repo
2.  `yarn`

## Usage

**Development**

`yarn start-dev`

* Build app continously (HMR enabled)
* App served @ `http://localhost:3000`

**Production**

`yarn start-prod`

* Build app once (HMR disabled)
* App served @ `http://localhost:3000`

---

**All commands**

| Command           | Description                                                             |
| ----------------- | ----------------------------------------------------------------------- |
| `yarn start-dev`  | Build app continously (HMR enabled) and serve @ `http://localhost:3000` |
| `yarn start-prod` | Build app once (HMR disabled) and serve @ `http://localhost:3000`       |
| `yarn build`      | Build app to `/build/`                                                  |
| `yarn test`       | Run tests                                                               |
| `yarn lint`       | Run JavaScript and SASS linter                                          |
| `yarn lint:js`    | Run JavaScript linter                                                   |
| `yarn lint:sass`  | Run SASS linter                                                         |
| `yarn start`      | (alias of `yarn start-dev`)                                             |
