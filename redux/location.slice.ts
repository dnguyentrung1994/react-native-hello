import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { ILocation, ILocationStore } from '../interfaces/location';
import ManagedInstance from '../utils/ManagedAxiosInstance';

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
    setListLocation(state, action: PayloadAction<Partial<ILocation>[]>) {
      state.listLocation.splice(0, state.listLocation.length);
      Object.assign(state.listLocation, action.payload);
    },
    setBarcodeData(state, action: PayloadAction<string>) {
      state.barcodeData = action.payload;
    },
  },
});

export const { setLocation, setListLocation, setBarcodeData } = locationSlice.actions;

export default locationSlice.reducer;

export const getLocation = (productCode: string) => async (dispatch: Dispatch) => {
  try {
    const { data } = await ManagedInstance.get(`api/exportMobile/location/${productCode}`);

    const locationData: ILocation[] = data.location.map((l: any) => {
      return {
        id: l.id,
        Pro_No: l.Pro_No,
        Building_No: l.Building_No,
        Floor_No: l.Floor_No,
        Row_Locate: l.Row_Locate,
        No_Locate: l.No_Locate,
        Shelf: l.Shelf,
        Note: l.Note,
        identify: data.imageLists[0],
      };
    });
    dispatch(setListLocation(locationData));
  } catch (error) {}
};
