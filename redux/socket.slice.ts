import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';
import { ISocket } from '../interfaces/socket';

const initialState: ISocket = {
  connected: false,
  onlineList: [],
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    // setSocket(state, action:PayloadAction<Socket>){
    //   state.socket = action.payload
    // }
  },
});
