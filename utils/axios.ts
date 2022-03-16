import axios from 'axios';
import Constants from 'expo-constants';

const unmanagedInstance = axios.create({
  baseURL: Constants?.manifest?.extra?.baseURL,
  headers: { 'Content-Type': 'application/json' },
});
export default unmanagedInstance;
