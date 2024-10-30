# Bar Project Frontend

## Frontend Options & Technology Stacks

For the bar project you can freely choose between two frontend options:

- `/plain`: Plain HTML, CSS, JavaScript project
  using [JQuery](https://jquery.com/) [Handlebars](https://handlebarsjs.com/)
  and [Bootstrap](https://getbootstrap.com/docs/4.6/getting-started/introduction/). (default configuration)


- `/react`: [React Framework](https://reactjs.org/) using [Drizzle](https://trufflesuite.com/docs/drizzle/)
  , [React Redux Store](https://react-redux.js.org/), [Ant Design](https://ant.design/docs/react/introduce)
  and [StyledComponents](https://styled-components.com/).

Both projects further use [web3](https://web3js.readthedocs.io/en/v1.7.1/#) as dependency.

## Setup and Development

Each frontend client contains a `package.json` file with all needed dependencies. Move to the corresponding directory
and run `npm install` to install them.

If you would like to run the frontend locally just run the command `npm run start` to start a local webserver
on [http://localhost:3000](http://localhost:3000).

## Configurations

Each project uses directly the compiled solidity contract build files (.json) to query the ABI for each contract for
on-chain communication. Depending on your frontend choice, configure the truffle build output directory
in `truffle-config.js`.

Both frontends use the web3.js WebsocketProvider for connecting to your blockchain client. By default, the address
points to your local Geth-client/the LVA-Chain (Port `8546`).   
If you e.g. would like to use the UI with the truffle development blockchain, change the port to `9545`. The
corresponding configuration snippets are marked with `TODO` and can be found in `/plain/src/js/main.js` or
`/react/src/util/config.js`

## Deployment

Your frontend must be deployed to your GitLab Pages instance. For doing so

- in case of frontend option `plain`, just copy the whole content in the `/src` directory to `/public` folder.
- in case of frontend option `react`, run the command `npm run build` for building a production build from the react
  app. Then copy & paste the output in `/build` to the
  `/public` directory.

NOTE: Do not forget to run `npm run compile` in the root directory for compiling your final contracts and updating the ABIs for the frontends.

## UI interaction

As already presented in the workshop, you have to type in the address of your bar contract into the header of the web UI
to connect to your deployed bar instance. Then, additional addresses/users can be invited via the corresponding input
field. The address that created the bar contract, will be automatically recognized as `owner`. Click on the different
role cards to open a menu modal, with available role-based interaction possibilities.
