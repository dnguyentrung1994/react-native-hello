import location from './location.store';

import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  location,
});

export default rootReducer;
