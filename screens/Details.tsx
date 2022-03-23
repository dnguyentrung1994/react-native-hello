import { View, Text, Image, FlatList, Alert, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-native-elements';
import { useAppDispatch, useAppState } from '../redux/store';
import { IItem } from '../interfaces/prepareItem';
import { removeItem } from '../redux/prepareList.slice';
import Constants from 'expo-constants';
import { io } from 'socket.io-client';
import dayjs from 'dayjs';
import { createShipment } from '../redux/location.slice';

const socketEndpoint = Constants?.manifest?.extra?.socketURL;
export default function Details({ navigation }: any) {
  const dispatch = useAppDispatch();

  const { orderList } = useAppState((state) => state.prepareList);
  const { socket } = useAppState((state) => state.socketSlice);
  const { userData } = useAppState((state) => state.auth);

  useEffect(() => {
    if (socket) {
      socket.emit('hello', 'world');
    }
    return () => {
      if (socket) {
        socket.off('hello');
        socket.off('prepareCompleted');
      }
    };
  }, [socket]);

  const ItemCard = ({ item }: { item: IItem }) => {
    const fadeAnimation = new Animated.Value(1);

    const animatedStyle = {
      opacity: fadeAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      height: fadeAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200],
      }),
      left: fadeAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [650, 0],
      }),
    };

    const fadeOut = () => {
      // Will change fadeAnimation value to 0 in 500 ms
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    };
    return (
      <Animated.View style={animatedStyle}>
        <Card>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Image style={{ width: 225, height: 150 }} source={{ uri: item.identify }} />
            <View>
              <Text>
                注文番号：　<Text style={{ fontWeight: 'bold' }}>{item.orderCode}</Text>
              </Text>
              <Text>
                製品番号：　<Text style={{ fontWeight: 'bold' }}>{item.productCode}</Text>
              </Text>
              <Text>
                数量：　<Text style={{ fontWeight: 'bold' }}>{item.quantity}</Text>
              </Text>
              <Text>ロケーション: </Text>
              <View style={{ marginLeft: 10 }}>
                {item.location &&
                  item.location
                    .slice(0, 3)
                    .map((data, index) => <Text key={index} style={{ fontWeight: 'bold' }}>{`-  ${data}`}</Text>)}
              </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Button
                title="削除"
                loading={false}
                loadingProps={{ size: 'small', color: 'white' }}
                icon={{
                  name: 'remove-shopping-cart',
                  type: 'material',
                  size: 15,
                  color: 'white',
                }}
                buttonStyle={{
                  backgroundColor: 'crimson',
                  borderRadius: 10,
                }}
                containerStyle={{
                  width: 80,
                  marginHorizontal: 40,
                  marginVertical: 15,
                }}
                onPress={() =>
                  Alert.alert('アイテム削除', `${item.orderCode}というアイテムを削除しますか？`, [
                    {
                      text: 'キャンセル',
                      style: 'cancel',
                    },
                    {
                      text: '確認',
                      onPress: async () => {
                        fadeOut();
                        await new Promise((r) => setTimeout(r, 500));
                        dispatch(removeItem(item.orderCode));
                        // Alert.alert('', '削除しました。', undefined, { cancelable: true });
                      },
                    },
                  ])
                }
              />
              <Button
                title="完了"
                loading={false}
                loadingProps={{ size: 'small', color: 'white' }}
                icon={{
                  name: 'fact-check',
                  type: 'material',
                  size: 15,
                  color: 'white',
                }}
                buttonStyle={{
                  backgroundColor: 'blue',
                  borderRadius: 10,
                }}
                containerStyle={{
                  width: 80,
                  marginHorizontal: 40,
                  marginVertical: 15,
                }}
                onPress={() =>
                  Alert.alert('処理完了', `${item.orderCode}というアイテムの処理は完了にしますか？`, [
                    {
                      text: 'キャンセル',
                      style: 'cancel',
                    },
                    {
                      text: '確認',
                      onPress: async () => {
                        // fadeOut();
                        // await new Promise((r) => setTimeout(r, 500));
                        // dispatch(removeItem(item.orderCode));
                        dispatch(
                          createShipment({
                            orderCode: item.orderCode,
                            quantity: item.quantity,
                            preparedTime: dayjs().format('YYYY/MM/DD HH:mm:ss'),
                          }),
                        );
                        if (socket)
                          socket.emit('prepareCompleted', {
                            productCode: item.productCode,
                            orderCode: item.orderCode,
                            user: userData.username,
                            time: dayjs().format('YYYY/MM/DD HH:mm:ss'),
                          });
                        // Alert.alert('', '削除しました。', undefined, { cancelable: true });
                      },
                    },
                  ])
                }
              />
            </View>
          </View>
        </Card>
      </Animated.View>
    );
  };
  return (
    <View>
      <FlatList
        style={{ marginVertical: 10 }}
        data={orderList}
        renderItem={ItemCard}
        keyExtractor={(item) => item.orderCode}
      ></FlatList>
    </View>
  );
}
