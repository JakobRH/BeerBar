import {BLOCK_RECEIVED, NEW_PEOPLE, SET_CONTRACT} from "./actions";
import {EventActions} from "@drizzle/store";
import {takeEvery} from "redux-saga/effects";
import {blockHeader, eventHandler, fetchPeople, setSongVotingBar} from "./handlers";

/**
 * App Sages
 */

function* appSaga() {
  yield takeEvery(SET_CONTRACT, setSongVotingBar);
  yield takeEvery(BLOCK_RECEIVED, blockHeader);
  yield takeEvery(EventActions.EVENT_FIRED, eventHandler);
  yield takeEvery(NEW_PEOPLE, fetchPeople);
}

const sagas = [appSaga];

export default sagas;