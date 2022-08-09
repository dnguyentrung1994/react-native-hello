import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IItem } from '../interfaces/prepareItem';
import _ from 'lodash';
import store from './store';

const initialState: { orderList: IItem[] } = {
  orderList: [],
};

const prepareListSlice = createSlice({
  name: 'prepareList',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<IItem>) {
      if (state.orderList.find((order) => order.orderCode === action.payload.orderCode) !== undefined) return;
      state.orderList.push(action.payload);
    },
    removeItem(state, action: PayloadAction<string>) {
      const newList = _.filter(state.orderList, (item) => item.orderCode !== action.payload);
      state.orderList = newList;
    },
    clearList(state) {
      state = initialState;
    },
  },
});

export const { addItem, removeItem, clearList } = prepareListSlice.actions;

export default prepareListSlice.reducer;
