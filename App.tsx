import { Provider } from 'react-redux';
import Navigation from './Navigation';
import store from './redux/store';
export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
