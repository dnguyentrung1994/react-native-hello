import { GestureResponderEvent } from 'react-native';
import React from 'react';
import { Button } from 'react-native-elements';

interface ButtonStyle {
  title: string;
  icon: string;
  iconFamily: string;
  buttonColor: string;
  onPress: (event: GestureResponderEvent) => void;
}

export default function MyButtonArea(buttonData: ButtonStyle) {
  return (
    <Button
      title={buttonData.title}
      icon={{
        name: buttonData.icon,
        type: buttonData.iconFamily,
        size: 15,
        color: 'white',
      }}
      buttonStyle={{
        backgroundColor: buttonData.buttonColor,
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 30,
      }}
      containerStyle={{
        width: '100%',
        marginVertical: 10,
      }}
      onPress={buttonData.onPress}
    />
  );
}
