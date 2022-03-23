import { Text, StyleSheet, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppState } from '../redux/store';
import ImageZoom from 'react-native-image-pan-zoom';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { FAB, SpeedDial } from 'react-native-elements';
import { addItem } from '../redux/prepareList.slice';
import Constants from 'expo-constants';
import { io } from 'socket.io-client';
import { setSocket } from '../redux/socket.slice';

const socketEndpoint = Constants?.manifest?.extra?.socketURL;
export default function Home({ navigation }: any) {
  const { location } = useAppState((state) => state);
  const { userData } = useAppState((state) => state.auth);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const dispatch = useAppDispatch();
  const [hasConnection, setConnection] = useState(false);

  useEffect(() => {
    const socket = io(socketEndpoint, {
      transports: ['websocket'],
    });

    socket.io.once('open', () => {
      setConnection(true);
      dispatch(setSocket({ socket: socket }));
      socket.emit('handshake', { username: userData.username });
      socket.on('onlineList', (data) => {
        console.log(data);
      });
    });

    socket.io.on('close', () => setConnection(false));

    return () => {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, []);

  return location.barcodeData === '' ? (
    <View style={styles.container}>
      <View style={styles.barCodeScanArea}>
        <FAB
          title="QR"
          icon={{
            name: 'qr-code-scanner',
            color: 'white',
          }}
          onPress={() => navigation.navigate('Barcode')}
        />
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.textAreaStyling}>
        <View style={styles.headerText}>
          <Text style={{ fontSize: 20 }}>
            製品番号: <Text style={styles.infoText}> {location.order.Pro_No}</Text>
          </Text>

          <Text style={{ fontSize: 20 }}>
            注文番号: <Text style={styles.infoText}>{location.order.Order_Code}</Text>
          </Text>
        </View>
        <View style={styles.workspace}>
          {location.warning && <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{location.warning}</Text>}
          <View style={styles.locationArea}>
            <Text style={styles.locationLabel}>ロケーション: </Text>

            {location.listLocation ? (
              location.listLocation.map((location, index) => (
                <Text style={styles.locationData} key={index}>
                  {location}
                </Text>
              ))
            ) : (
              <ContentLoader
                speed={1}
                interval={0.15}
                width={580}
                height={480}
                viewBox="0 20 580 480"
                backgroundColor="#d3d3d3"
                foregroundColor="#ecebeb"
              >
                {[...new Array(5).fill(1)].map((_, index) => (
                  <Rect key={index} x="20" y={(index + 1) * 25} rx="4" ry="4" width="100" height="16" />
                ))}
              </ContentLoader>
            )}
          </View>
          <View style={styles.operationArea}>
            <Text style={styles.locationLabel}>注文状態: </Text>
            {location.order.deadline || location.order.error ? (
              <View>
                {location.order.deadline && (
                  <View>
                    <Text style={styles.locationData}>
                      納期: <Text>{location.order.deadline}</Text>
                    </Text>
                    <Text style={styles.locationData}>
                      数量: <Text>{location.order.quantity}</Text>
                    </Text>
                  </View>
                )}
                {location.order.error && (
                  <View>
                    <Text style={styles.locationData}>
                      エラー: <Text>{location.order.error}</Text>
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <ContentLoader
                speed={1}
                interval={0.15}
                width={580}
                height={480}
                viewBox="0 20 580 480"
                backgroundColor="#d3d3d3"
                foregroundColor="#ecebeb"
              >
                {[...new Array(5).fill(1)].map((_, index) => (
                  <Rect key={index} x="20" y={(index + 1) * 25} rx="4" ry="4" width="100" height="16" />
                ))}
              </ContentLoader>
            )}
          </View>
        </View>
      </View>
      <View style={styles.imageAreaStyling}>
        {location.order?.identify && location.order.identify !== '' ? (
          <ImageZoom cropWidth={580} cropHeight={480} imageWidth={600} imageHeight={400}>
            <Image style={{ width: 600, height: 400 }} source={{ uri: location.order?.identify }} />
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
      <View style={styles.speedDial}>
        <SpeedDial
          isOpen={openSpeedDial}
          color="red"
          icon={{ name: 'edit', color: '#fff' }}
          openIcon={{ name: 'close', color: '#fff' }}
          onOpen={() => setOpenSpeedDial(!openSpeedDial)}
          onClose={() => setOpenSpeedDial(!openSpeedDial)}
          overlayColor="transparent"
        >
          <SpeedDial.Action
            icon={{ name: 'qr-code-scanner', color: '#fff' }}
            title="QR"
            onPress={() => navigation.navigate('Barcode')}
            color="rgba(42, 150, 122, 0.8)"
            style={{ marginVertical: 10 }}
            titleStyle={{ fontSize: 20 }}
          />
          <SpeedDial.Action
            icon={{ name: 'add-shopping-cart', color: '#fff' }}
            title="加える"
            onPress={() =>
              dispatch(
                addItem({
                  orderCode: location.order.Order_Code,
                  productCode: location.order.Pro_No,
                  quantity: location.order.quantity || 0,
                  location: location.listLocation,
                  identify: location.order.identify,
                }),
              )
            }
            style={{ marginVertical: 10 }}
            titleStyle={{ fontSize: 20 }}
            disabled={location.order.error !== undefined || location.order.isCompleted || location.order.isCanceled}
          />
        </SpeedDial>
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
    marginTop: 10,
  },

  infoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  //workspace styling
  workspace: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 20,
    flexDirection: 'row',
  },

  //location data area styling
  locationArea: {
    width: '45%',
  },

  locationLabel: {
    fontSize: 20,
    marginBottom: 10,
  },
  locationData: {
    fontSize: 16,
    marginLeft: 20,
    paddingBottom: 9,
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
    backgroundColor: 'transparent',
  },
  speedDial: {
    bottom: 0,
    right: 0,
    width: 200,
    height: 200,
    display: 'flex',
    position: 'absolute',
    flexDirection: 'column',
    zIndex: 999,
    backgroundColor: 'transparent',
  },
});
