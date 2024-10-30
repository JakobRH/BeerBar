const BeerToken = artifacts.require("BeerToken");
const SongVotingBar = artifacts.require("SongVotingBar");

// Deploys the BeerToken and SongVotingBar contract. The latter inherits the BeerBar.
module.exports = function(deployer) {
  deployer.deploy(BeerToken);
  deployer.deploy(SongVotingBar);
};
