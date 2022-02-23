import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILocation, ILocationStore } from '../interfaces/location';

const initialState: ILocationStore = {
  locate: {
    id: 'OK baby',
    Pro_No: '',
  },
  listLocation: [],
};
const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation(state, action: PayloadAction<Partial<ILocation>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { setLocation } = locationSlice.actions;

export default locationSlice.reducer;
