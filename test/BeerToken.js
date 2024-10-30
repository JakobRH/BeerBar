const truffleAssert = require('truffle-assertions');

const BeerToken = artifacts.require("BeerToken");

contract("BeerToken test", async accounts => {
  let owner = accounts[0];
  let partygoer = accounts[1];

  it("should be indivisible", async () => {
    let instance = await BeerToken.deployed();
    let decimals = await (instance.decimals.call()).valueOf();
    assert.equal(decimals, 0);
  });

  it("should be mintable", async () => {
    let instance = await BeerToken.deployed();
    let amount1 = (await instance.totalSupply.call()).toNumber();
    let result = await instance.mint(owner, 100);
    truffleAssert.eventEmitted(result, 'Transfer');
    let amount2 = (await instance.totalSupply.call()).toNumber();
    assert.equal(amount2 - amount1, 100);
  });

  it("should not be mintable by someone else", async () => {
    let instance = await BeerToken.deployed();
    await truffleAssert.reverts(instance.mint(owner, 100, {'from': partygoer}));
  });

  it("should be burnable", async () => {
    let instance = await BeerToken.deployed();
    await instance.mint(partygoer, 10);
    let amount1 = (await instance.balanceOf.call(partygoer)).toNumber();
    await instance.burn(10, {'from': accounts[1]});
    let amount2 = (await instance.balanceOf.call(partygoer)).toNumber();
    assert.equal(amount1 - amount2, 10);
  });

  it("tokens are transferred correctly", async () => {
    let instance = await BeerToken.deployed();
    await instance.mint(owner, 100);
    let balanceBefore = (await instance.balanceOf(partygoer)).toNumber();
    let tx = await instance.transfer(partygoer, 50, {'from': owner});
    truffleAssert.eventEmitted(tx, 'Transfer');
    let balanceAfter = (await instance.balanceOf(partygoer)).toNumber();
    assert.equal(balanceAfter - balanceBefore, 50)
  });

});

