import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';

import React, { useEffect, useState } from 'react';
import store, { useAppState } from './redux/store';
import Home from './screens/Home';
import Details from './screens/Details';
import UserIcon from './components/common/UserIcon';
import BarcodeScanScreen from './screens/BarcodeScan';
import Login from './screens/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthToken, setAuth } from './redux/auth.slice';
import Loading from './screens/loading';

export default function Navigation() {
  const Tab = createBottomTabNavigator();
  const { auth } = useAppState((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAuthToken());
  }, []);
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
    <NavigationContainer>
      {auth.refreshToken === true ? (
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
      ) : auth.refreshToken === false ? (
        <Tab.Navigator
          screenOptions={() => ({
            headerShown: false,
            tabBarStyle: { display: 'none' },
          })}
        >
          <Tab.Screen name="Login" options={{}} component={Login} />
        </Tab.Navigator>
      ) : (
        <Tab.Navigator
          screenOptions={() => ({
            headerShown: false,
            tabBarStyle: { display: 'none' },
          })}
        >
          <Tab.Screen name="Loading" options={{}} component={Loading} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}
