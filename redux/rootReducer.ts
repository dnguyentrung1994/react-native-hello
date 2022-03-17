import location from './location.slice';
import auth from './auth.slice';
import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  location,
  auth,
});

export default rootReducer;
