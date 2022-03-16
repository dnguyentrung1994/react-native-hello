import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';

const initialState = '';

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<string>) {
      state = action.payload;
    },
  },
});

export const { setAuth } = authSlice.actions;

export default authSlice.reducer;

export const getAuthToken = () => async (dispatch: Dispatch) => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    dispatch(setAuth(refreshToken || ''));
  } catch (error) {
    console.error(error);
  }
};
