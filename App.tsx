import { Provider } from 'react-redux';
import Navigation from './Navigation';
import store from './redux/store';
import Constants from 'expo-constants';
import { useKeepAwake } from 'expo-keep-awake';

const socketEndpoint = Constants?.manifest?.extra?.socketURL;
export default function App() {
  useKeepAwake();
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
