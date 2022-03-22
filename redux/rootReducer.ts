import location from './location.slice';
import auth from './auth.slice';
import prepareList from './prepareList.slice';
import socketSlice from './socket.slice';
import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  location,
  auth,
  prepareList,
  socketSlice,
});

export default rootReducer;
