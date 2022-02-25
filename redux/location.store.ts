import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILocation, ILocationStore } from '../interfaces/location';

const initialState: ILocationStore = {
  locate: {
    id: 'OK baby',
    Pro_No: '',
  },
  listLocation: [],
  barcodeData: '',
};
const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation(state, action: PayloadAction<Partial<ILocation>>) {
      Object.assign(state, action.payload);
    },
    setBarcodeData(state, action: PayloadAction<string>) {
      state.barcodeData = action.payload;
    },
  },
});

export const { setLocation, setBarcodeData } = locationSlice.actions;

export default locationSlice.reducer;
