import { Text, StyleSheet, View, Image } from 'react-native';
import React from 'react';
import { useAppState } from '../redux/store';
import ImageZoom from 'react-native-image-pan-zoom';
import MyButtonArea from '../components/common/MyButtonArea';
import ContentLoader, { Rect } from 'react-content-loader/native';

export default function Home({ navigation }: any) {
  const { location, auth } = useAppState((state) => state);

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
      <View style={styles.textAreaStyling}>
        <View style={styles.headerText}>
          <Text style={{ fontSize: 20 }}>
            製品番号: <Text style={styles.infoText}> {location.locate.Pro_No}</Text>
          </Text>

          <Text style={{ fontSize: 20 }}>
            注文番号: <Text style={styles.infoText}>{location.locate.Order_Code}</Text>
          </Text>
        </View>
        <View style={styles.workspace}>
          <View style={styles.locationArea}>
            <Text style={{ fontSize: 20 }}>ロケーション: </Text>
            {location.listLocation.map((location, index) => (
              <Text style={styles.locationData} key={index}>
                {location}
              </Text>
            ))}
          </View>
          <View style={styles.operationArea}></View>
        </View>
      </View>
      <View style={styles.imageAreaStyling}>
        {location.locate?.identify && location.locate.identify !== '' ? (
          <ImageZoom cropWidth={580} cropHeight={480} imageWidth={600} imageHeight={400}>
            <Image style={{ width: 600, height: 400 }} source={{ uri: location.locate?.identify }} />
          </ImageZoom>
        ) : (
          <ContentLoader
            speed={1}
            interval={0.15}
            width={580}
            height={480}
            viewBox="0 0 580 480"
            backgroundColor="#d3d3d3"
            foregroundColor="#ecebeb"
          >
            {[...new Array(14).fill(1)].map((_, index) => (
              <Rect key={index} x="40" y={(index + 1) * 30} rx="4" ry="4" width="500" height="20" />
            ))}
          </ContentLoader>
        )}
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
  /*--------------------------------------General styling--------------------------------------*/
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },
  /*------------------------------------Text Area's styling-------------------------------------*/

  textAreaStyling: {
    marginHorizontal: '5%',
  },

  //header styling
  headerText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  infoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  //workspace styling
  workspace: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 30,
  },

  //location data area styling
  locationArea: {
    width: '45%',
  },

  locationData: {
    fontSize: 16,
  },

  //operational area styling
  operationArea: {
    width: '45%',
  },

  /*------------------------------------Image Area's styling------------------------------------*/
  imageAreaStyling: {
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
  },

  /*-------------------------------------Barcode Area's styling---------------------------------*/
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
