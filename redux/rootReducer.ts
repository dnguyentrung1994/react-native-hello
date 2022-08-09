import location from './location.slice';
import auth from './auth.slice';
import prepareList from './prepareList.slice';
import socketSlice from './socket.slice';
import shipmentsSlice from './shipments.slice';
import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  location,
  auth,
  prepareList,
  socketSlice,
  shipmentsSlice,
});

export default rootReducer;
