import { Provider } from 'react-redux';
import Navigation from './Navigation';
import store from './redux/store';
import Constants from 'expo-constants';

const socketEndpoint = Constants?.manifest?.extra?.socketURL;
export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
