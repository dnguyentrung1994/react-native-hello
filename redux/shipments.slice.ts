import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { IShipment, IShipmentList } from '../interfaces/shipments';

const initialState: IShipmentList = {
  myShipments: [],
  otherShipments: [],
};

const shipmentSlice = createSlice({
  name: 'shipment',
  initialState,
  reducers: {
    addShipment(state, action: PayloadAction<IShipment>) {
      if (_.findIndex(state.otherShipments, (shipment) => shipment.id === action.payload.id) === -1)
        state.otherShipments.push(action.payload);
    },
    addMyShipment(state, action: PayloadAction<number>) {
      const shipment = _.find(state.otherShipments, (shipment) => shipment.id === action.payload);
      if (shipment) {
        state = {
          myShipments: [...state.myShipments, shipment],
          otherShipments: _.filter(state.otherShipments, (shipment) => shipment.id !== action.payload),
        };
      }
    },
    deleteMyShipment(state, action: PayloadAction<number>) {
      state.myShipments = _.filter(state.myShipments, (shipment) => shipment.id !== action.payload);
    },
  },
});
