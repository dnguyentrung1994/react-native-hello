import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';

import React from 'react';
import store from './redux/store';
import Home from './screens/Home';
import Details from './screens/Details';
import UserIcon from './components/common/UserIcon';

export default function Navigation() {
  const Tab = createBottomTabNavigator();

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
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Details" component={Details} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
