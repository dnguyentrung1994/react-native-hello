import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { Alert } from 'react-native';
import { Socket } from 'socket.io-client';
import { ILocation, ILocationStore, IOrder } from '../interfaces/location';
import ManagedInstance from '../utils/ManagedAxiosInstance';
import { addMyShipment } from './shipments.slice';

const initialState: ILocationStore = {
  order: {
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
        order: {
          Pro_No: productCode,
          Order_Code: orderCode,
          identify: '',
        },
        listLocation: undefined,
        barcodeData: qrcode,
      }),
    );

    const { locationData, orderData, warning } = await (
      await ManagedInstance.get(`api/exportMobile/orderInfo/${orderCode}/${productCode}`)
    ).data;

    const locations: string[] = locationData.location.map((l: any) => {
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

      return `${location.Building_No || ''}${location.Floor_No || ''} ${
        location.Building_No || location.Floor_No ? '-' : ''
      } ${location.Row_Locate || ''}${location.No_Locate || ''}${location.Shelf || ''} ${location.Note ? '-' : ''} ${
        location.Note || ''
      }`;
    });

    const order: IOrder = orderData.error
      ? {
          Pro_No: productCode,
          Order_Code: orderCode,
          identify: locationData.imageLists[0],
          error: orderData.error.message,
        }
      : {
          Pro_No: productCode,
          Order_Code: orderCode,
          deadline: orderData.orderInfo.deadline,
          isCompleted: orderData.orderInfo.quantity === 0,
          isCanceled: orderData.orderInfo.isCanceled === 1,
          quantity: orderData.orderInfo.quantity,
          identify: locationData.imageLists[0],
          deliverPoint: orderData.orderInfo.deliverPoint,
          nextProcess: orderData.orderInfo.nextProcess,
          readOnlyOrder: orderData.readOnlyOrder,
        };
    dispatch(
      setLocation({
        order,
        listLocation: locations,
        barcodeData: qrcode,
        warning,
      }),
    );
  } catch (error: any) {
    console.error(error.response.data);
  }
};

export const createShipment =
  (
    inputData: {
      productCode: string;
      orderCode: string;
      quantity: number;
      preparedTime: string;
      user: string;
      identify: string;
    },
    socket: any,
  ) =>
  async (dispatch: Dispatch) => {
    try {
      const { shipment } = await (
        await ManagedInstance.post('api/exportMobile/shipment', {
          shipmentData: { ...inputData, user: undefined, productCode: undefined },
        })
      ).data;
      dispatch(
        addMyShipment({
          id: shipment.id,
          orderCode: shipment.orderCode,
          productCode: inputData.productCode,
          quantity: shipment.quantity,
          preparedBy: shipment.preparedBy,
          preparedTime: shipment.preparedTime,
          identify: inputData.identify,
        }),
      );
      socket &&
        socket.emit('prepareCompleted', {
          ...inputData,
          preparedBy: shipment.preparedBy,
          user: undefined,
          id: shipment.id,
        });
    } catch (error: any) {
      console.error(error.response.data);
      Alert.alert('エラー発生', error.response.data.message, [], { cancelable: true });
    }
  };
