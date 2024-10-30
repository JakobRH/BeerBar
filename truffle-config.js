/**
 * Use this file to configure your truffle project.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 */
const path = require("path");
module.exports = {
  // Configure your compilers
  compilers: {
    solc: {
      version: '^0.8.0',
    }
  },

  contracts_build_directory: path.join(__dirname, "frontend/plain/src/abi"), // PLAIN FRONTEND
  // contracts_build_directory: path.join(__dirname, "frontend/react/src/abi"), // REACT FRONTEND

  /**
   * Networks define how you connect to your ethereum client. If you don't specify one, truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */
  networks: {
    // The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // development: {
    //   host: "127.0.0.1",
    //   port: 7545,
    //   network_id: "*"
    // },
    // This network can be used to deploy directly to the LVA-Chain. Check that your Geth-Client is up and running!
    deploy: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
  }
};
