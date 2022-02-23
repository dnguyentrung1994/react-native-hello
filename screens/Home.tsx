import { Text, SafeAreaView } from 'react-native';
import React from 'react';
import { useAppState } from '../redux/store';

export default function Home() {
  const { location } = useAppState((state) => state);

  return (
    <SafeAreaView>
      <Text>{location.locate.id}</Text>
    </SafeAreaView>
  );
}
