import { Text, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppState } from '../redux/store';
import { BarCodeScanner } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';

export default function Home() {
  const { location } = useAppState((state) => state);

  return (
    <View>
      {location.barcodeData !== '' && <Text>{location.barcodeData}</Text>}
      <TouchableOpacity onPress={() => {}}>
        <Text>Read barcode?</Text>
      </TouchableOpacity>
    </View>
  );
}
