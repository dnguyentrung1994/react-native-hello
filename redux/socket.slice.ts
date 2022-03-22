import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';
import { ISocket } from '../interfaces/socket';

const initialState: ISocket = {
  connected: false,
  onlineList: [],
  socket: undefined,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket(state, action: PayloadAction<Partial<ISocket>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { setSocket } = socketSlice.actions;

export default socketSlice.reducer;
