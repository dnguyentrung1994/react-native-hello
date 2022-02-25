import { Text, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppState } from '../redux/store';
import { BarCodeScanner } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';

export default function Home() {
  const { location } = useAppState((state) => state);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scanMode, setScanMode] = useState(false);

  const finderWidth: number = 280;
  const finderHeight: number = 230;
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const viewMinX = (width - finderWidth) / 2;
  const viewMinY = (height - finderHeight) / 2;
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data, bounds: { origin } }: any) => {
    const { x, y } = origin;
    if (x >= viewMinX && y >= viewMinY && x <= viewMinX + finderWidth / 2 && y <= viewMinY + finderHeight / 2) {
    }
    setScanned(true);
    setScanMode(false);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View>
      <Text>{location.locate.id}</Text>
      {!scanned && !scanMode && (
        <TouchableOpacity onPress={() => setScanMode(!scanMode)}>
          <Text>Use Scanner?</Text>
        </TouchableOpacity>
      )}
      {scanMode && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          style={[StyleSheet.absoluteFillObject, styles.barcodeArea]}
        >
          <View
            style={{
              flex: 1,

              backgroundColor: 'transparent',

              flexDirection: 'row',
            }}
          ></View>
          <BarcodeMask edgeColor="#62B1F6" showAnimatedLine />
        </BarCodeScanner>
      )}
      {scanned && (
        <TouchableOpacity
          onPress={() => {
            setScanMode(true);
            setScanned(false);
          }}
        >
          <Text>Scan Again?</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  barcodeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
