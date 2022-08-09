import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { Alert } from 'react-native';
import { IShipment, IShipmentList } from '../interfaces/shipments';
import ManagedInstance from '../utils/ManagedAxiosInstance';
const initialState: IShipmentList = {
  myShipments: [],
  otherShipments: [],
};

const shipmentSlice = createSlice({
  name: 'shipment',
  initialState,
  reducers: {
    setShipments(state, action: PayloadAction<IShipmentList>) {
      Object.assign(state, action.payload);
    },

    addShipment(state, action: PayloadAction<IShipment>) {
      if (_.findIndex(state.otherShipments, (shipment) => shipment.id === action.payload.id) === -1)
        state.otherShipments.push(action.payload);
    },

    updateCheckShipment(state, action: PayloadAction<Partial<IShipment>>) {
      if (action.payload?.id) {
        const newState = state;
        const affectedOtherShipment = _.findIndex(
          newState.otherShipments,
          (shipment) => shipment.id === action.payload.id,
        );
        const affectedMyShipment = _.findIndex(newState.myShipments, (shipment) => shipment.id === action.payload.id);
        if (affectedOtherShipment !== -1) {
          newState.otherShipments[affectedOtherShipment].checkedBy = action.payload?.checkedBy || undefined;
        }
        if (affectedMyShipment !== -1) {
          newState.myShipments[affectedMyShipment].checkedBy = action.payload?.checkedBy || undefined;
        }
        Object.assign(state, newState);
      }
    },

    deleteShipment(state, action: PayloadAction<number>) {
      state.otherShipments = _.filter(state.otherShipments, (shipment) => shipment.id !== action.payload);
    },

    addMyShipment(state, action: PayloadAction<IShipment>) {
      state.myShipments.push(action.payload);
    },

    deleteMyShipment(state, action: PayloadAction<number>) {
      state.myShipments = _.filter(state.myShipments, (shipment) => shipment.id !== action.payload);
    },

    registerCheck(state, action: PayloadAction<number>) {
      const shipmentInCheck = _.find(state.otherShipments, (s) => s.id === action.payload);
      state.checking = shipmentInCheck;
      state.otherShipments = _.filter(state.otherShipments, (s) => s.id !== action.payload);
    },

    cancelCheck(state) {
      if (state.checking) state.otherShipments.push(state.checking);
      state.checking = undefined;
    },

    revertChecking(state) {
      state.checking = undefined;
    },
  },
});

export const {
  setShipments,
  addShipment,
  updateCheckShipment,
  deleteShipment,
  addMyShipment,
  deleteMyShipment,
  registerCheck,
  cancelCheck,
  revertChecking,
} = shipmentSlice.actions;

export default shipmentSlice.reducer;

export const getShipments = () => async (dispatch: Dispatch) => {
  try {
    const { data } = await ManagedInstance.get('api/exportMobile/shipments');
    dispatch(setShipments(data));
  } catch (error: any) {
    console.error(error.response.data);
  }
};

export const registerCheckShipment = (shipmentId: number, socket: any) => async (dispatch: Dispatch) => {
  try {
    await ManagedInstance.post('/api/exportMobile/registerCheckShipment', {
      shipmentId,
    }).then((result) => {
      if (result.status === 200) {
        dispatch(registerCheck(shipmentId));
        socket &&
          socket.emit('toServer-registerCheck', {
            id: shipmentId,
            checkedBy: result.data.fullname,
          });
      }
    });
  } catch (error: any) {
    Alert.alert('エラー発生', error.response.data.message, [], { cancelable: true });
  }
};

export const cancelCheckShipment = (shipmentId: number, socket: any) => async (dispatch: Dispatch) => {
  await ManagedInstance.post('/api/exportMobile/cancelCheckShipment').then((result) => {
    if (result.status === 200) {
      dispatch(cancelCheck());
      socket.emit('toServer-cancelCheck', {
        id: shipmentId,
      });
    }
  });
};

export const confirmShipment = (shipmentId: number, socket: any, reasons?: string[]) => async (dispatch: Dispatch) => {
  try {
    await ManagedInstance.post('/api/exportMobile/confirmShipment', {
      shipmentId,
      reason: reasons ? JSON.stringify(reasons) : undefined,
    }).then((result) => {
      if (result.status === 200) {
        dispatch(revertChecking());
        socket.emit('toServer-cancelCheck', {
          id: shipmentId,
        });
      }
    });
  } catch (error: any) {
    Alert.alert('エラー発生', error.response.data.message, [], { cancelable: true });
  }
};

export const cancelMyShipment = (shipmentId: number, socket: any) => async (dispatch: Dispatch) => {
  await ManagedInstance.delete(`/api/exportMobile/shipment/${shipmentId}`).then((result) => {
    if (result.status === 200) {
      dispatch(deleteMyShipment(shipmentId));
      socket.emit('toServer-cancelCheck', {
        id: shipmentId,
      });
    }
  });
};
