import { Text, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppState } from '../redux/store';
import { BarCodeScanner } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';

export default function Home() {
  const { location } = useAppState((state) => state);
  return (
    <View>
      {location.barcodeData !== '' && (
        <View>
          <Text>productCode: {location.barcodeData.split('')[2].slice(1).trim()}</Text>
          <Text>orderCode: {location.barcodeData.split('')[9].slice(1).trim()}</Text>
        </View>
      )}
    </View>
  );
}
