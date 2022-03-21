import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IItem } from '../interfaces/prepareItem';
import _ from 'lodash';

const initialState: IItem[] = [];

const prepareListSlice = createSlice({
  name: 'prepareList',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<IItem>) {
      if (_.findIndex(state, (item) => item.orderCode === action.payload.orderCode) === -1) state.push(action.payload);
    },
    removeItem(state, action: PayloadAction<string>) {
      state = _.filter(state, (item) => item.orderCode !== action.payload);
      console.log(state);
    },
    clearList(state) {
      state = initialState;
    },
  },
});

export const { addItem, removeItem, clearList } = prepareListSlice.actions;

export default prepareListSlice.reducer;
