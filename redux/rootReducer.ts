import location from './location.slice';
import user from './user.slice';
import auth from './auth.slice';
import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  location,
  user,
  auth,
});

export default rootReducer;
