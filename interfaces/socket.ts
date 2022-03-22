import { Socket } from 'socket.io-client';

export interface ISocket {
  connected: boolean;
  onlineList: IOnlineUser[];
  socket?: Socket;
}

export interface IOnlineUser {
  socketID: string;
  username: string;
}
