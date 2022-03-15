import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';

import React from 'react';
import store from './redux/store';
import Home from './screens/Home';
import Details from './screens/Details';
import UserIcon from './components/common/UserIcon';
import BarcodeScanScreen from './screens/BarcodeScan';

export default function Navigation() {
  const Tab = createBottomTabNavigator();
  function HomeTabs() {
    return (
      <Tab.Navigator
        screenOptions={() => ({
          headerShown: false,
          tabBarStyle: { display: 'none' },
        })}
      >
        <Tab.Screen
          name="Location"
          options={{
            title: 'ロケーション',
          }}
          component={Home}
        />
        <Tab.Screen
          name="Barcode"
          options={{
            title: 'バーコード',
          }}
          component={BarcodeScanScreen}
        />
      </Tab.Navigator>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => {
              let iconName: string = '';

              switch (route.name) {
                case 'Home':
                  iconName = 'directions';
                  break;
                case 'Details':
                  iconName = 'info';
                  break;

                default:
                  throw Error('Missing Screen!');
              }

              return (
                <Icon
                  name={iconName}
                  size={25}
                  style={{
                    marginBottom: 3,
                    alignSelf: 'center',
                    color: focused ? 'red' : 'gray',
                  }}
                />
              );
            },
            headerShown: true,
            headerRight: () => <UserIcon />,
          })}
        >
          <Tab.Group>
            <Tab.Screen name="Home" options={{}} component={HomeTabs} />
            <Tab.Screen name="Details" component={Details} />
          </Tab.Group>
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
