import location from './location.slice';
import user from './user.slice';
import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  location,
  user,
});

export default rootReducer;
