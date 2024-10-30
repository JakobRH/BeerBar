import {
  NEW_PEOPLE_RECEIVED, SETUP_BAR_RECEIVED, UPDATE_PEOPLE_DATA, BAR_OPENED, BAR_CLOSED,
  BARKEEPER_ADDED, OWNER_ADDED, OWNER_REMOVED, BARKEEPER_REMOVED
} from "./actions";
import _ from "lodash";
import {getBarData, getBeerTokenData, getPeopleData} from "./getters";
import {put} from "redux-saga/effects";
import {store, getSongVotingBar, getBeerToken} from "../util/config";

/**
 * Handles events from SongVotingBar contract
 */
export function* eventHandler(action) {
  const eventName = action.event.event;
  const changedAddress = action.event.returnValues[0] + "";
  const currentState = store.getState();

  if (action.event.event === BAR_OPENED) {
    yield put({type: SETUP_BAR_RECEIVED, newState: {open: true}});
  }
  if (action.event.event === BAR_CLOSED) {
    yield put({type: SETUP_BAR_RECEIVED, newState: {open: false}});
  }

  const SongVotingBar = getSongVotingBar(currentState.bar.barAddress);
  const BeerToken = getBeerToken(currentState.bar.beerAddress);
  if (eventName === OWNER_ADDED) {
    const personData = yield getPeopleData(
      SongVotingBar,
      BeerToken,
      changedAddress
    );
    yield put({
      type: NEW_PEOPLE_RECEIVED,
      newState: {
        added: true,
        ...personData,
        roles: ["owner"],
      },
    });
  }
  if (eventName === BARKEEPER_ADDED) {
    const personData = yield getPeopleData(
      SongVotingBar,
      BeerToken,
      changedAddress
    );
    yield put({
      type: NEW_PEOPLE_RECEIVED,
      newState: {
        added: true,
        ...personData,
        roles: ["barkeeper"],
      },
    });
  }
  if (eventName === OWNER_REMOVED) {
    yield put({
      type: NEW_PEOPLE_RECEIVED,
      newState: {role: "owner", address: changedAddress, added: false},
    });
  }
  if (eventName === BARKEEPER_REMOVED) {
    yield put({
      type: NEW_PEOPLE_RECEIVED,
      newState: {role: "barkeeper", address: changedAddress, added: false},
    });
  }
}

/**
 * Handles the update of the bar and invitees data on each new block
 */
export function* blockHeader(action) {
  const {SongVotingBar, BeerToken} = action.drizzle.contracts;
  if (SongVotingBar) {
    let beerAddress = yield SongVotingBar.methods
      .beerTokenContractAddress()
      .call();
    const currentState = store.getState();
    const currentBeerAddress = _.get(currentState, "bar.beerAddress");
    if (currentBeerAddress !== beerAddress)
      yield setBeerToken(BeerToken, beerAddress, SongVotingBar._address);

    let newState = yield getBarData(SongVotingBar, BeerToken);
    yield put({type: SETUP_BAR_RECEIVED, newState});

    const {staff} = store.getState();
    const {partyPeople} = staff;
    yield updatePeopleData(SongVotingBar, BeerToken, partyPeople);
  }
}

/**
 * Creates/saves initial data objects for the invitees
 */
export function* fetchPeople(action) {
  const {person} = action.payload;
  const currentState = store.getState();
  const SongVotingBar = getSongVotingBar(currentState.bar.barAddress);
  const newState = yield getPeopleData(SongVotingBar, null, person, true);
  newState["added"] = true;
  yield put({type: NEW_PEOPLE_RECEIVED, newState});
}

/**
 * Handles the update of invitees data on each new block
 */
function* updatePeopleData(SongVotingBar, BeerToken, partyPeople) {
  let counter = 0;
  while (counter < partyPeople.length) {
    const person = partyPeople[counter];
    const newState = yield getPeopleData(
      SongVotingBar,
      BeerToken,
      person.address
    );
    yield put({
      type: UPDATE_PEOPLE_DATA,
      newState,
    });
    counter++;
  }
}

/**
 * Adds SongVotingBar contract to drizzle and adds initial bar data to the store
 */
export function* setSongVotingBar(action) {
  const {address} = action.payload;
  const currentState = store.getState();
  const SongVotingBar = _.get(currentState, "contracts.SongVotingBar");

  let deleted = false;
  if (SongVotingBar) {
    yield put({type: "DELETE_CONTRACT", contractName: "SongVotingBar"});
    deleted = true;
  }
  if (!SongVotingBar || deleted) {
    try {
      /**
       * Add SongVotingBar to Drizzle
       */
      const SongVotingBar = getSongVotingBar(address);
      let contractConfig = {
        contractName: "SongVotingBar",
        web3Contract: SongVotingBar,
      };
      let events = [
        "OwnerAdded",
        "OwnerRemoved",
        "BarkeeperAdded",
        "BarkeeperRemoved",
        "BarOpened",
        "BarClosed",
      ];

      const newState = yield getBarData(SongVotingBar, null);
      yield put({type: SETUP_BAR_RECEIVED, newState});

      const currentState = store.getState();
      const BeerToken = _.get(currentState, "contracts.BeerToken");
      let beerAddress = yield SongVotingBar.methods
        .beerTokenContractAddress()
        .call();
      yield setBeerToken(BeerToken, beerAddress, address);

      yield put({type: "ADD_CONTRACT", contractConfig, events});
    } catch (error) {
      console.log("error", error);
    }
  }
}

/**
 * Adds BeerToken contract to drizzle and adds initial beer token data to the store
 */
export function* setBeerToken(BeerToken, address, songVotingBarAddress) {
  let deleted = false;
  if (BeerToken) {
    yield put({type: "DELETE_CONTRACT", contractName: "BeerToken"});
    deleted = true;
  }
  if (
    (!BeerToken || deleted) &&
    address !== "0x0000000000000000000000000000000000000000"
  ) {
    try {
      /**
       * Add BeerToken to Drizzle
       */
      const BeerToken = getBeerToken(address);
      const isValid = yield BeerToken.methods
        .balanceOf("0x0000000000000000000000000000000000000000")
        .call();
      if (isValid) {
        let contractConfig = {
          contractName: "BeerToken",
          web3Contract: BeerToken,
        };
        let events = [];
        const newState = {
          beerAddress: address,
          ...(yield getBeerTokenData(BeerToken, songVotingBarAddress)),
        };
        yield put({type: SETUP_BAR_RECEIVED, newState});
        yield put({type: "ADD_CONTRACT", contractConfig, events});
      }
    } catch (error) {
      console.log("error", error);
    }
  }
}
