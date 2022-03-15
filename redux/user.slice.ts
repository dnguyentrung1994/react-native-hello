import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../interfaces/user';

const initialState: IUser = {
  id: '',
  username: '',
  fullname: '',
  role: '',
  avatar: '',
  accessToken: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser | null>) {
      if (action.payload) {
        Object.assign(state, action.payload);
      } else {
        Object.assign(state, initialState);
      }
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
