import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { IAuth, ILoginForm, IToken, IUser } from '../interfaces/user';
import unmanagedInstance from '../utils/UnmanagedAxiosInstance';
import jwtDecode from 'jwt-decode';
import dayjs from 'dayjs';

const initialState: IAuth = {
  refreshToken: null,
  userData: {
    id: '',
    username: '',
    fullname: '',
    role: '',
    avatar: '',
    accessToken: '',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<string>) {
      state.refreshToken = action.payload !== '';
    },
    setUserData(state, action: PayloadAction<IUser | null>) {
      if (action.payload) {
        Object.assign(state.userData, action.payload);
      } else {
        Object.assign(state.userData, initialState.userData);
      }
    },
  },
});

export const { setAuth, setUserData } = authSlice.actions;

export default authSlice.reducer;

export const loginAsync = (payload: ILoginForm) => async (dispatch: Dispatch) => {
  try {
    const { data } = await unmanagedInstance.post('/api/login', payload);

    const userData: IUser = {
      username: data.employee.username,
      id: data.employee.id,
      fullname: data.employee.fullname,
      avatar: data.employee.avatar,
      role: data.employee.role,
      accessToken: data.accessToken,
    };
    const storeItem = {
      refreshToken: data.refreshToken,
      userData,
    };

    await AsyncStorage.setItem('auth', JSON.stringify(storeItem));
    dispatch(setUserData(userData));
    dispatch(setAuth(data.refreshToken));
  } catch (error) {}
};

export const getAuthToken = () => async (dispatch: Dispatch) => {
  try {
    await AsyncStorage.getItem('auth', (err, result) => {
      if (err) {
        console.error(err);
        throw err;
      }

      const payload = result ? JSON.parse(result) : '';

      if (payload?.refreshToken) {
        const refreshToken: IToken = jwtDecode(payload.refreshToken);
        const refreshTokenExpireDate = dayjs.unix(refreshToken.exp);

        if (refreshTokenExpireDate.diff(dayjs()) < 1) {
          dispatch(setAuth(''));
          dispatch(setUserData(null));
        } else {
          dispatch(setAuth(payload?.refreshToken || ''));
          dispatch(setUserData(payload?.userData || null));
        }
      } else {
        dispatch(setAuth(''));
        dispatch(setUserData(null));
      }

      return result || '';
    });
  } catch (error) {
    console.error(error);
  }
};
