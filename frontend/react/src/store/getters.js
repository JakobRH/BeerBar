import {getBeerToken, web3} from "../util/config";
import _ from 'lodash';

/**
 * Returns data needed for an invitee
 */
export function* getPeopleData(SongVotingBar, BeerToken, person) {
  const isOwner = yield SongVotingBar.methods.isOwner(person).call();
  const isBarkeeper = yield SongVotingBar.methods.isBarkeeper(person).call();
  let balance = yield web3.eth.getBalance(person);
  const pendingBeer = yield SongVotingBar.methods.pendingBeer(person).call();
  const newState = {
    roles: _.compact([isOwner && "owner", isBarkeeper && "barkeeper", "partyPeople"]),
    address: person,
    balance,
    pendingBeer
  };
  let beerAddress = yield SongVotingBar.methods.beerTokenContractAddress().call();
  try {
    if (!BeerToken)
      BeerToken = getBeerToken(beerAddress);

    newState["beerTokens"] = yield BeerToken.methods.balanceOf(person).call();
  } catch (error) {
    // No beerTokenAddress set, yet, ignore.
  }
  return newState;
}

/**
 * Returns data needed for the bar
 */
export function* getBarData(SongVotingBar, BeerToken) {
  const address = SongVotingBar._address;
  const balance = yield web3.eth.getBalance(address);
  let beerPrice = yield SongVotingBar.methods.getBeerPrice().call();
  let open = yield SongVotingBar.methods.barIsOpen().call();
  let beerAddress = yield SongVotingBar.methods.beerTokenContractAddress().call();
  let newState = {barAddress: address, balance, open, beerPrice, beerAddress};
  let beerTokenData = {};
  try {
    beerTokenData = yield getBeerTokenData(BeerToken, address);
  } catch (error) {
    // No beerTokenAddress set, yet, ignore.
  }
  return {...newState, ...beerTokenData};
}

/**
 * Returns data needed from the beerTokenAddress contract
 */
export function* getBeerTokenData(BeerToken, songVotingBarAddress) {
  const newState = {};
  newState["beerTokenAddress"] = yield BeerToken._address;
  newState["beerAmount"] = yield BeerToken.methods.balanceOf(songVotingBarAddress).call();
  newState["beerTotalSupply"] = yield BeerToken.methods.totalSupply().call();
  newState["beerName"] = yield BeerToken.methods.name().call();
  newState["beerSymbol"] = yield BeerToken.methods.symbol().call();
  return newState;
}