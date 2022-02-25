import { useIsFocused } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import { Button } from 'react-native-elements';
import { setBarcodeData } from '../redux/location.store';
import { useAppDispatch } from '../redux/store';

const finderWidth: number = 300;
const finderHeight: number = 300;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;

export default function BarcodeScanScreen({ navigation }: any) {
  const isFocus = useIsFocused();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  useEffect(() => {
    return () => {
      setScanned(false);
    };
  }, [isFocus]);

  const handleBarCodeScanned = ({ type, data, bounds: { origin } }: any) => {
    const { x, y } = origin;
    if (x >= viewMinX && y >= viewMinY && x <= viewMinX + finderWidth / 2 && y <= viewMinY + finderHeight / 2) {
      setScanned(true);
      dispatch(setBarcodeData(data));
      alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  console.log(scanned);
  return isFocus ? (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          style={[StyleSheet.absoluteFillObject, styles.barcodeArea]}
        >
          <BarcodeMask
            width={finderWidth - 150}
            height={finderHeight - 150}
            edgeColor="#62B1F6"
            showAnimatedLine={false}
            outerMaskOpacity={0.7}
          />
        </BarCodeScanner>
      </View>

      {scanned && (
        <View style={styles.scanAgainArea}>
          <Button
            title={'Back'}
            icon={{
              name: 'arrow-left',
              type: 'font-awesome',
              size: 15,
              color: 'white',
            }}
            buttonStyle={{
              backgroundColor: 'rgba(244, 132, 42, 0.8)',
              borderColor: 'transparent',
              borderWidth: 0,
              borderRadius: 30,
            }}
            containerStyle={{
              width: '100%',
              marginVertical: 10,
            }}
            onPress={() => navigation.navigate('Location')}
          />
          <Button
            title={'Scan Again'}
            icon={{
              name: 'redo',
              type: 'font-awesome-5',
              size: 15,
              color: 'white',
            }}
            buttonStyle={{
              backgroundColor: 'rgba(42, 150, 244, 0.8)',
              borderColor: 'transparent',
              borderWidth: 0,
              borderRadius: 30,
            }}
            containerStyle={{
              width: '100%',
              marginVertical: 10,
            }}
            onPress={() => setScanned(false)}
          />
        </View>
      )}
    </View>
  ) : (
    <View></View>
  );
}
const styles = StyleSheet.create({
  barcodeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanAgainArea: {
    bottom: 0,
    right: 0,
    width: '20%',
    display: 'flex',
    position: 'absolute',
    flexDirection: 'column',
    marginBottom: 20,
  },
});
