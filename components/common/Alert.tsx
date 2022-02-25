import { Alert, StyleSheet } from 'react-native';

export default function FatalError(message: string) {
  return Alert.alert('FATAL ERROR', message, [
    {
      text: 'OK',
      onPress: () => console.log('OK'),
    },
  ]);
}
