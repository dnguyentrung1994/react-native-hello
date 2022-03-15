import axios from 'axios';
import { useAppState } from '../redux/store';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import dayjs from 'dayjs';
import { IToken } from '../interfaces/user';

const useAxios = async () => {
  const { accessToken } = useAppState((state) => state.user);
  const refreshToken = await AsyncStorage.getItem('refresh-token');

  const axiosInstance = axios.create({
    baseURL: Constants?.manifest?.extra?.baseURL || 'http:\\localhost:5000',
    headers: { Authorization: accessToken },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const user: IToken = jwtDecode(accessToken);
    const isExpired = dayjs.unix(user.exp);
  });
};
