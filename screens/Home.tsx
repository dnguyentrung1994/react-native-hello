import { Text, StyleSheet, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppState } from '../redux/store';
import ImageZoom from 'react-native-image-pan-zoom';
import MyButtonArea from '../components/common/MyButtonArea';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageViewer from 'react-native-image-zoom-viewer';

export default function Home({ navigation }: any) {
  const { location, auth } = useAppState((state) => state);

  const [uri, setUri] = useState('http://172.16.0.17/image/erraa/image-00000.jpg');

  useEffect(() => {
    setUri(location.listLocation[0].identify || 'http://172.16.0.17/image/erraa/image-00000.jpg');
  }, [location.listLocation]);
  return location.barcodeData === '' ? (
    <View style={styles.container}>
      <View style={styles.barCodeScanArea}>
        <MyButtonArea
          title="QR"
          icon="qrcode"
          iconFamily="font-awesome"
          buttonColor="rgba(42, 150, 244, 0.8)"
          onPress={() => navigation.navigate('Barcode')}
        />
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      <View>
        <Text>productCode: {location.barcodeData.split('')[2].slice(1).trim()}</Text>
        <Text>orderCode: {location.barcodeData.split('')[9].slice(1).trim()}</Text>
      </View>
      <View
        style={{
          display: 'flex',
          marginLeft: 10,
          marginRight: 10,
          marginTop: 30,
          borderWidth: 1,
          borderColor: 'black',
          overflow: 'hidden',
          zIndex: 1,
          bottom: 40,
          position: 'absolute',
        }}
      >
        <ImageZoom cropWidth={580} cropHeight={480} imageWidth={600} imageHeight={400}>
          <Image style={{ width: 600, height: 400 }} source={{ uri: uri }} />
        </ImageZoom>
      </View>
      <View style={styles.barCodeScanArea}>
        <MyButtonArea
          title="QR"
          icon="qrcode"
          iconFamily="font-awesome"
          buttonColor="rgba(42, 150, 122, 0.8)"
          onPress={() => navigation.navigate('Barcode')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },

  barCodeScanArea: {
    bottom: -100,
    right: 0,
    width: 100,
    height: 200,
    display: 'flex',
    position: 'absolute',
    flexDirection: 'column',
    zIndex: 999,
  },
});
