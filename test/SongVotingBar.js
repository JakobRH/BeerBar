const truffleAssert = require('truffle-assertions');

const BeerToken = artifacts.require("BeerToken");
const SongVotingBar = artifacts.require("SongVotingBar");

contract("SongVotingBar test", async accounts => {
  let beerToken;
  let songVotingBar;

  let owner = accounts[0];
  let barkeeper = accounts[1];
  let dj = accounts[2];
  let partygoer1 = accounts[3];

  async function deployAndInit() {
    beerToken = await BeerToken.new();

    songVotingBar = await SongVotingBar.new();
    await songVotingBar.setBeerTokenContractAddress(beerToken.address);
  }

  beforeEach("deploy and init", async () => {
    await deployAndInit();

  });

  it("owner should be set", async () => {
    assert(await songVotingBar.isOwner(owner));
  });

  it("dj should be set", async () => {
    let result = await songVotingBar.addDJ(dj);

    truffleAssert.eventEmitted(result, 'DJAdded', (ev) => {
      return ev['account'] === dj;
    }, 'DJAdded should be emitted with correct parameters');

    assert(await songVotingBar.isDJ(dj));
  });

  it("voting no started when not opened before", async () => {
    assert.equal(await songVotingBar.votingIsActive.call(), false);
  });

  it("owner and barkeeper cannot start voting", async () => {
    await songVotingBar.addBarkeeper(barkeeper);
    await truffleAssert.reverts(songVotingBar.startVoting({from: owner}));
    await truffleAssert.reverts(songVotingBar.startVoting({from: barkeeper}));
    assert.equal(await songVotingBar.votingIsActive.call(), false);
  });

  it("dj cant start voting when bar is closed", async () => {
    await songVotingBar.addDJ(dj);
    await truffleAssert.reverts(songVotingBar.startVoting({from: dj}));
    assert.equal(await songVotingBar.votingIsActive.call(), false);
  });

  it("dj can start voting", async () => {
    await songVotingBar.addBarkeeper(barkeeper);
    await songVotingBar.openBar({from: barkeeper});
    await songVotingBar.addDJ(dj);
    let result = await songVotingBar.startVoting({from: dj});
    truffleAssert.eventEmitted(result, 'VotingStarted');
    assert.equal(await songVotingBar.votingIsActive.call(), true);
  });

  it("voting is ended when bar is closed", async () => {
    await songVotingBar.addBarkeeper(barkeeper);
    await songVotingBar.openBar({from: barkeeper});
    await songVotingBar.addDJ(dj);
    await songVotingBar.startVoting({from: dj});
    await songVotingBar.closeBar({from: barkeeper});
    assert.equal(await songVotingBar.votingIsActive.call(), false);
  });

  it("dj cant play song if bar is closed", async () => {
    await songVotingBar.addDJ(dj);
    await truffleAssert.reverts(songVotingBar.playNextSong({from: dj}));
  });

  it("dj cant play song if there is no song in playlist", async () => {
    await songVotingBar.addBarkeeper(barkeeper);
    await songVotingBar.openBar({from: barkeeper});
    await songVotingBar.addDJ(dj);
    await truffleAssert.reverts(songVotingBar.playNextSong({from: dj}));
  });

  it("owner and barkeeper cant play songs", async () => {
    await beerToken.mint(owner, 100);
    await beerToken.methods['transfer(address,uint256,bytes)'](songVotingBar.address, 100, web3.utils.fromAscii("supply"), {from: owner});
    await songVotingBar.setBeerPrice(10);
    await songVotingBar.addBarkeeper(barkeeper);
    await songVotingBar.openBar({from: barkeeper});
    await songVotingBar.addDJ(dj);
    await songVotingBar.startVoting({from: dj});
    await songVotingBar.voteSong("Rick Astley - Never Gonna Give You Up", {value: 100, from: partygoer1});
    await truffleAssert.reverts(songVotingBar.playNextSong({from: owner}));
    await truffleAssert.reverts(songVotingBar.playNextSong({from: barkeeper}));
  });

  it("others cant vote songs when voting not started", async () => {
    await beerToken.mint(owner, 100);
    await beerToken.methods['transfer(address,uint256,bytes)'](songVotingBar.address, 100, web3.utils.fromAscii("supply"), {from: owner});
    await songVotingBar.setBeerPrice(10);
    await songVotingBar.addBarkeeper(barkeeper);
    await songVotingBar.openBar({from: barkeeper});

    await truffleAssert.reverts(songVotingBar.voteSong("Rick Astley - Never Gonna Give You Up", {value: 100, from: partygoer1}));
  });

  it("others cant vote songs when voting ended", async () => {
    await beerToken.mint(owner, 100);
    await beerToken.methods['transfer(address,uint256,bytes)'](songVotingBar.address, 100, web3.utils.fromAscii("supply"), {from: owner});
    await songVotingBar.setBeerPrice(10);
    await songVotingBar.addBarkeeper(barkeeper);
    await songVotingBar.openBar({from: barkeeper});
    await songVotingBar.addDJ(dj);
    await songVotingBar.startVoting({from: dj});
    await songVotingBar.endVoting({from: dj});

    await truffleAssert.reverts(songVotingBar.voteSong("Rick Astley - Never Gonna Give You Up", {value: 100, from: partygoer1}));
  });

  it("others can vote songs and get tokens", async () => {
    await beerToken.mint(owner, 100);
    await beerToken.methods['transfer(address,uint256,bytes)'](songVotingBar.address, 100, web3.utils.fromAscii("supply"), {from: owner});
    await songVotingBar.setBeerPrice(10);
    await songVotingBar.addBarkeeper(barkeeper);
    await songVotingBar.openBar({from: barkeeper});
    await songVotingBar.addDJ(dj);
    await songVotingBar.startVoting({from: dj});

    let amountBefore = (await beerToken.balanceOf.call(partygoer1)).toNumber();
    await songVotingBar.voteSong("Rick Astley - Never Gonna Give You Up", {value: 100, from: partygoer1});
    let amountAfterwards = (await beerToken.balanceOf.call(partygoer1)).toNumber();
    assert.equal(amountAfterwards - amountBefore, 10);
  });

  it("others can vote songs and get tokens with tip", async () => {
    await beerToken.mint(owner, 100);
    await beerToken.methods['transfer(address,uint256,bytes)'](songVotingBar.address, 100, web3.utils.fromAscii("supply"), {from: owner});
    await songVotingBar.setBeerPrice(10);
    await songVotingBar.addBarkeeper(barkeeper);
    await songVotingBar.openBar({from: barkeeper});
    await songVotingBar.addDJ(dj);
    await songVotingBar.startVoting({from: dj});

    let amountBefore = (await beerToken.balanceOf.call(partygoer1)).toNumber();
    await songVotingBar.voteSong("Rick Astley - Never Gonna Give You Up", {value: 99, from: partygoer1});
    let amountAfterwards = (await beerToken.balanceOf.call(partygoer1)).toNumber();
    assert.equal(amountAfterwards - amountBefore, 9);
  });

  it("dj plays songs in correct order", async () => {
    await beerToken.mint(owner, 100);
    await beerToken.methods['transfer(address,uint256,bytes)'](songVotingBar.address, 100, web3.utils.fromAscii("supply"), {from: owner});
    await songVotingBar.setBeerPrice(10);
    await songVotingBar.addBarkeeper(barkeeper);
    await songVotingBar.openBar({from: barkeeper});
    await songVotingBar.addDJ(dj);
    await songVotingBar.startVoting({from: dj});

    await songVotingBar.voteSong("Boney M. - Rasputin", {value: 10, from: partygoer1});
    await songVotingBar.voteSong("Abba - Dancing Queen", {value: 10, from: partygoer1});
    await songVotingBar.voteSong("Abba - Dancing Queen", {value: 10, from: partygoer1});
    await songVotingBar.voteSong("Rick Astley - Never Gonna Give You Up", {value: 10, from: partygoer1});
    await songVotingBar.voteSong("Rick Astley - Never Gonna Give You Up", {value: 10, from: partygoer1});
    await songVotingBar.voteSong("Rick Astley - Never Gonna Give You Up", {value: 10, from: partygoer1});

    assert.equal(await songVotingBar.playNextSong.call({from: dj}), "Rick Astley - Never Gonna Give You Up");
    await songVotingBar.playNextSong({from: dj});
    assert.equal(await songVotingBar.playNextSong.call({from: dj}), "Abba - Dancing Queen");
    await songVotingBar.playNextSong({from: dj});
    assert.equal(await songVotingBar.playNextSong.call({from: dj}), "Boney M. - Rasputin");
  });

  it("dj plays correct song after second voting", async () => {
    await beerToken.mint(owner, 100);
    await beerToken.methods['transfer(address,uint256,bytes)'](songVotingBar.address, 100, web3.utils.fromAscii("supply"), {from: owner});
    await songVotingBar.setBeerPrice(10);
    await songVotingBar.addBarkeeper(barkeeper);
    await songVotingBar.openBar({from: barkeeper});
    await songVotingBar.addDJ(dj);
    await songVotingBar.startVoting({from: dj});

    await songVotingBar.voteSong("Boney M. - Rasputin", {value: 10, from: partygoer1});
    assert.equal(await songVotingBar.playNextSong.call({from: dj}), "Boney M. - Rasputin");

    await songVotingBar.endVoting({from: dj});
    await songVotingBar.startVoting({from: dj});

    await songVotingBar.voteSong("Rick Astley - Never Gonna Give You Up", {value: 10, from: partygoer1});
    assert.equal(await songVotingBar.playNextSong.call({from: dj}), "Rick Astley - Never Gonna Give You Up");

  });

});
