import axios from 'axios';
import { useAppState } from '../redux/store';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import dayjs from 'dayjs';
import { IToken } from '../interfaces/user';

const axiosInstance = axios.create({
  baseURL: Constants?.manifest?.extra?.baseURL,
});

axiosInstance.interceptors.request.use(async (req) => {
  const jsonData = await AsyncStorage.getItem('auth');
  const authData = jsonData ? JSON.parse(jsonData) : null;

  if (authData?.refreshToken) {
    const user: IToken = jwtDecode(authData.refreshToken);
    const isExpired = dayjs.unix(user.exp);

    if (isExpired.diff(dayjs()) < 1) {
      const response = await axios.post(`${Constants?.manifest?.extra?.baseURL}/api/refresh_token`, null, {
        withCredentials: true,
        headers: {
          Cookie: `refreshToken=${authData.refreshToken}`,
        },
      });

      const newAuthData = {
        refreshToken: response.data.accessToken,
        userData: {
          username: response.data.employee.username,
          id: response.data.employee.id,
          fullname: response.data.employee.fullname,
          avatar: response.data.employee.avatar,
          role: response.data.employee.role,
          accessToken: response.data.accessToken,
        },
      };

      await AsyncStorage.setItem('auth', JSON.stringify(newAuthData));
      req.headers = {
        Authorization: response.data.accessToken,
      };
      return req;
    } else {
      req.headers = {
        Authorization: authData.userData.accessToken,
      };
      return req;
    }
  }
});
export default axiosInstance;
