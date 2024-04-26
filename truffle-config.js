const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = "portion ribbon timber copy slogan orchard magnet picnic result warm pledge defy";

module.exports = {
  networks: {
    development: {
      provider: () => new HDWalletProvider(mnemonic, "http://127.0.0.1:7545"),
      network_id: "*"
    },
    develop: {
      port: 8545
    }
  }
};
