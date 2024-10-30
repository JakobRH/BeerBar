import _ from 'lodash';
import {NEW_PEOPLE_RECEIVED, SETUP_BAR_RECEIVED, UPDATE_PEOPLE_DATA} from './actions';

/**
 * Reducers
 */

const initialBarState = {
  barAddress: "",
  balance: 0,
  open: false,
  beerPrice: 0,
  beerTokenAddress: "",
  beerAmount: 0,
  beerTotalSupply: 0,
  beerName: "",
  beerSymbol: ""
};
const initialStaffState = {owners: [], barkeepers: [], partyPeople: []};

/**
 * Handles the store.bar state
 */
const barReducer = (state = initialBarState, action) => {

  if (action.type === SETUP_BAR_RECEIVED) {
    const {newState} = action;
    return {...state, ...newState};
  }
  return state;
};


/**
 * Handles the store.staff state, which contains:
 * owners: an array containing invited owners addresses
 * barkeepers: an array containing invited barkeepers addresses
 * partyPeople: an array that containts data such as address, balance, pendingBeer, beerTokens for each invitee
 */
const staffReducer = (state = initialStaffState, action) => {
  if (action.type === NEW_PEOPLE_RECEIVED) {
    const {newState} = action;
    const {added, roles, role, address, balance, pendingBeer, beerTokens} = newState;
    let {owners, barkeepers, partyPeople} = state;

    // if a new role is added to the person handle it here
    if (added) {
      (roles || []).forEach(r => {
        switch (r) {
          case "owner":
            owners.push(address);
            break;
          case "barkeeper":
            barkeepers.push(address);
            break;
          default:
            break;
        }
      });
      partyPeople.push({address, balance, pendingBeer, beerTokens});
    } else {
      // if a role was removed from an invitee handle it here
      switch (role) {
        case "owner":
          _.remove(owners, item => item === address);
          break;
        case "barkeeper":
          _.remove(barkeepers, item => item === address);
          break;
        default:
          break;
      }
    }
    return {
      owners: _.uniq(owners),
      barkeepers: _.uniq(barkeepers),
      partyPeople: _.uniqBy(partyPeople, item => item.address)
    };
  }

  //update data ( address, balance, pendingBeer, beerTokens) of the invitee here
  if (action.type === UPDATE_PEOPLE_DATA) {
    const {newState} = action;
    const {address, balance, pendingBeer, beerTokens} = newState;
    let {partyPeople} = state;
    const foundIndex = partyPeople.findIndex(x => x.address === address);
    partyPeople[foundIndex] = {
      ...partyPeople[foundIndex],
      balance,
      pendingBeer,
      beerTokens
    };
    return {...state, partyPeople};
  }
  return state;
};

const reducers = {bar: barReducer, staff: staffReducer};

export default reducers;