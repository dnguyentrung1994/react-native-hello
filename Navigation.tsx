import { useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';

import React, { useEffect, useState } from 'react';
import { useAppState } from './redux/store';
import Home from './screens/Home';
import Details from './screens/Details';
import UserIcon from './components/common/UserIcon';
import BarcodeScanScreen from './screens/BarcodeScan';
import Login from './screens/Login';
import { getAuthToken } from './redux/auth.slice';
import Loading from './screens/Loading';
import useWillMount from './utils/useWillMount';
import CheckScreen from './screens/CheckScreen';

export default function Navigation() {
  const Tab = createBottomTabNavigator();
  const { userData, refreshToken } = useAppState((state) => state.auth);
  const dispatch = useDispatch();

  useWillMount(() => dispatch(getAuthToken()));

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
      {refreshToken === true ? (
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
                  iconName = 'list-alt';
                  break;
                case 'ShipmentCheck':
                  iconName = 'check-double';
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
            <Tab.Screen name="Home" options={{ title: 'ホーム' }} component={HomeTabs} />
            <Tab.Screen name="Details" options={{ title: '注番リスト' }} component={Details} />
            <Tab.Screen name="ShipmentCheck" options={{ title: 'ダブルチェック' }} component={CheckScreen} />
          </Tab.Group>
        </Tab.Navigator>
      ) : refreshToken === false ? (
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
