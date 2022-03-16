import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ILoginForm, IUser } from '../interfaces/user';
import unmanagedInstance from '../utils/axios';

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

export const loginAsync = (payload: ILoginForm) => async (dispatch: Dispatch) => {
  try {
    const { data } = await unmanagedInstance.post('/api/login', payload);

    const userData: IUser = {
      username: data.employee.username,
      id: data.employee.id,
      fullname: data.employee.fullname,
      avatar: data.employee.fullname,
      role: data.employee.role,
      accessToken: data.accessToken,
    };

    dispatch(setUser(userData));

    await AsyncStorage.setItem('refreshToken', data.refreshToken);
  } catch (error: any) {
    console.error(error.response.data);
  }
};
