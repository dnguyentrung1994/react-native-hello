import { BarCodeScanner } from 'expo-barcode-scanner';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import { Button } from 'react-native-elements';
import { setBarcodeData } from '../redux/location.store';
import { useAppDispatch } from '../redux/store';

const finderWidth: number = 200;
const finderHeight: number = 200;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;

export default function BarcodeScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const dispatch = useAppDispatch();
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
    dispatch(setBarcodeData(data));
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={[StyleSheet.absoluteFillObject, styles.barcodeArea]}
      >
        <BarcodeMask edgeColor="#62B1F6" showAnimatedLine />
      </BarCodeScanner>
      {scanned && <Button title="Scan Again" onPress={() => setScanned(false)} />}
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
