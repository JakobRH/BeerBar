import Web3 from "web3";
import {generateStore} from "@drizzle/store";
import SongVotingBarAbi from "../abi/SongVotingBar.json";
import BeerTokenAbi from "../abi/BeerToken.json";
import reducers from "../store/reducers";
import sagas from "../store/sagas";

const web3CustomProvider = "ws://localhost:8546"; // TODO Edit to desired network
export const web3 = new Web3(web3CustomProvider);

export const getSongVotingBar = (address) => {
  return new web3.eth.Contract(SongVotingBarAbi.abi, address);
};

export const getBeerToken = (address) => {
  return new web3.eth.Contract(BeerTokenAbi.abi, address);
};

export const drizzleOptions = {
  web3: {
    block: false,
    customProvider: web3,
  },
  polls: {
    blocks: 3000
  },
  contracts: [],
  events: {},
};

// NOTE: The interface type of `generateStore` is wrong. The functions attribute name for the reducers is `appReducers` NOT `reducers`.
export const store = generateStore({
  drizzleOptions,
  appReducers: reducers,
  appSagas: sagas,
  disableReduxDevTools: false, // enable ReduxDevTools!
});
