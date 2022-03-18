import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { ILocation, ILocationStore } from '../interfaces/location';
import ManagedInstance from '../utils/ManagedAxiosInstance';

const initialState: ILocationStore = {
  locate: {
    Pro_No: '',
    Order_Code: '',
  },
  listLocation: [],
  barcodeData: '',
};
const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation(state, action: PayloadAction<Partial<ILocationStore>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { setLocation } = locationSlice.actions;

export default locationSlice.reducer;

export const getLocation = (qrcode: string) => async (dispatch: Dispatch) => {
  try {
    const productCode = qrcode.split('')[2].slice(1).trim();
    const rawOrderCode = qrcode.split('')[9].slice(1).trim();
    const orderCode =
      rawOrderCode[0] === 'A' ? rawOrderCode.slice(0, 8) : rawOrderCode[0] === 'B' ? rawOrderCode.slice(0, 7) : '不正';
    dispatch(
      setLocation({
        locate: {
          Pro_No: productCode,
          Order_Code: orderCode,
          identify: '',
        },
        barcodeData: qrcode,
      }),
    );
    const { data } = await ManagedInstance.get(`api/exportMobile/location/${productCode}`);

    const locationData: string[] = data.location.map((l: any) => {
      const location: ILocation = {
        id: l.id,
        Pro_No: l.Pro_No,
        Building_No: l.Building_No !== 0 ? l.Building_No : undefined,
        Floor_No: l.Floor_No !== 0 ? l.Floor_No : undefined,
        Row_Locate: l.Row_Locate !== '' ? l.Row_Locate : undefined,
        No_Locate: l.No_Locate !== '' ? l.No_Locate : undefined,
        Shelf: l.Shelf !== 0 ? l.Shelf : undefined,
        Note: l.Note !== '' ? l.Note : undefined,
      };

      return `${location.Building_No || ''}${location.Floor_No || ''}${
        location.Building_No || location.Floor_No ? '-' : ''
      }${location.Row_Locate || ''}${location.No_Locate || ''}${location.Shelf || ''}${location.Note || ''}`;
    });
    dispatch(
      setLocation({
        locate: {
          Pro_No: productCode,
          Order_Code: orderCode,
          identify: data.imageLists[0],
        },
        listLocation: locationData,
        barcodeData: qrcode,
      }),
    );
  } catch (error) {}
};
