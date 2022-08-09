import { View, Text, Image, Alert, Animated, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Overlay } from 'react-native-elements';
import { useAppDispatch, useAppState } from '../redux/store';
import { IItem } from '../interfaces/prepareItem';
import { removeItem } from '../redux/prepareList.slice';
import dayjs from 'dayjs';
import { createShipment } from '../redux/location.slice';

export default function Details() {
  const dispatch = useAppDispatch();

  const { orderList } = useAppState((state) => state.prepareList);
  const { socket } = useAppState((state) => state.socketSlice);
  const { userData } = useAppState((state) => state.auth);

  const [overlay, setOverlay] = useState<{
    item?: IItem;
    animation?: () => void;
  }>({
    item: undefined,
  });
  const toggleOverlay = (data?: { item: IItem; animation?: () => void }) => {
    if (overlay.item) {
      setOverlay({
        item: undefined,
        animation: data?.animation ? data.animation : undefined,
      });
      setMaxValue(undefined);
      setValue(undefined);
      setFormatError(false);
      setOverflowError(false);
      setMinusValueError(false);
    } else {
      if (!data) {
        Alert.alert('error');
      } else {
        setOverlay({
          item: data.item,
        });
      }
    }
  };
  const resetOverlay = () => {
    setOverlay({
      item: undefined,
      animation: undefined,
    });
    setMaxValue(undefined);
    setValue(undefined);
    setFormatError(false);
    setOverflowError(false);
    setMinusValueError(false);
  };

  const [value, setValue] = useState<string | undefined>(undefined);
  const [maxValue, setMaxValue] = useState<number | undefined>(undefined);
  const [formatError, setFormatError] = useState(false);
  const [overflowError, setOverflowError] = useState(false);
  const [minusValueError, setMinusValueError] = useState(false);
  useEffect(() => {
    if (value && maxValue) {
      setFormatError(false);
      setOverflowError(false);
      setMinusValueError(false);
      if (isNaN(Number(value))) {
        setFormatError(true);
      }
      if (Number.parseInt(value) > maxValue) {
        setOverflowError(true);
      }
      if (Number.parseInt(value) <= 0) {
        setMinusValueError(true);
      }
    }
  }, [value, maxValue]);
  const ItemCard = ({ item }: { item: IItem }) => {
    const fadeAnimation = new Animated.Value(1);
    const completedAnimation = new Animated.Value(0);
    const FadingAnimatedStyle = {
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
    const CompletedAnimatedStyle = {
      backgroundColor: completedAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(32, 246, 110, 0)', 'rgba(32, 246, 110, 1)'],
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
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
        <Animated.View style={[CompletedAnimatedStyle, FadingAnimatedStyle, { minWidth: '100%' }]}>
          <Card wrapperStyle={{ minWidth: '95%' }}>
            <View style={{ display: 'flex', flexDirection: 'row', minWidth: '95%' }}>
              <Image style={{ width: 225, height: 150 }} source={{ uri: item.identify }} />
              <View>
                <Text>
                  製品番号：　<Text style={{ fontWeight: 'bold' }}>{item.productCode}</Text>
                </Text>
                <Text>
                  数量：　<Text style={{ fontWeight: 'bold' }}>{item.quantity}</Text>
                </Text>
                <Text>
                  次工程：　<Text style={{ fontWeight: 'bold' }}>{item.nextProcess}</Text>
                </Text>
                <Text>
                  納入先：　<Text style={{ fontWeight: 'bold' }}>{item.deliverPoint}</Text>
                </Text>
                <Text>ロケーション: </Text>
                <View style={{ marginLeft: 10 }}>
                  {item.location &&
                    item.location
                      .slice(0, 3)
                      .map((data, index) => <Text key={index} style={{ fontWeight: 'bold' }}>{`-  ${data}`}</Text>)}
                </View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'absolute',
                  paddingRight: 20,
                  right: 0,
                }}
              >
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
                          Alert.alert('', '削除しました。', undefined, { cancelable: true });
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
                    marginVertical: 15,
                  }}
                  onPress={() => {
                    setValue(item.quantity.toString());
                    setMaxValue(item.quantity);
                    toggleOverlay({
                      item: item,
                      animation: fadeOut,
                    });
                  }}
                />
              </View>
            </View>
          </Card>
        </Animated.View>
      </View>
    );
  };
  return (
    <View>
      <Animated.FlatList
        style={{ marginVertical: 0 }}
        data={orderList}
        renderItem={ItemCard}
        keyExtractor={(item) => item.orderCode}
      ></Animated.FlatList>
      <Overlay
        isVisible={typeof overlay.item !== 'undefined'}
        onBackdropPress={toggleOverlay}
        overlayStyle={{ width: '90%' }}
      >
        <View style={{ display: 'flex', flexDirection: 'column' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>処理完了</Text>
          <Divider style={{ marginBottom: 10 }} />
        </View>

        {overlay?.item?.orderCode && (
          <View style={{ display: 'flex', flexDirection: 'column', marginBottom: 20 }}>
            <Text
              style={{ fontSize: 16, fontWeight: 'normal' }}
            >{`${overlay.item.orderCode}の準備が完了にしますか？`}</Text>
            <Text>
              注文数量:　<Text style={{ fontWeight: 'bold' }}>{overlay.item.quantity}</Text>
            </Text>
          </View>
        )}

        {overlay?.item?.quantity && (
          <View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
              <Text>完了数量: </Text>
              <TextInput
                style={{ borderColor: 'black', borderBottomWidth: 1, minWidth: 50, marginLeft: 10 }}
                keyboardType="numeric"
                value={value}
                onChangeText={setValue}
              />
            </View>
            {formatError && <Text style={{ color: 'red' }}>数字だけで入力してください</Text>}
            {overflowError && <Text style={{ color: 'red' }}>最大出庫数量が超えてしまいました。</Text>}
            {minusValueError && <Text style={{ color: 'red' }}>入力した数量は負の数になりました。</Text>}
          </View>
        )}

        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <Button
            title="キャンセル"
            loading={false}
            loadingProps={{ size: 'small', color: 'white' }}
            icon={{
              name: 'cancel',
              type: 'material',
              size: 15,
              color: 'white',
            }}
            buttonStyle={{
              backgroundColor: 'crimson',
              borderRadius: 10,
              minWidth: 80,
            }}
            containerStyle={{
              marginLeft: '40%',
              marginRight: 10,
            }}
            onPress={() => {
              resetOverlay();
              if (overlay.animation) overlay.animation();
            }}
          />
          <Button
            title="確認"
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
              minWidth: 80,
            }}
            containerStyle={{
              marginLeft: 10,
              marginRight: 10,
            }}
            disabled={formatError || overflowError || typeof overlay.item === 'undefined'}
            onPress={() => {
              if (typeof overlay.item !== 'undefined') {
                resetOverlay();
                dispatch(
                  createShipment(
                    {
                      productCode: overlay.item.productCode,
                      orderCode: overlay.item.orderCode,
                      quantity: Number(value),
                      preparedTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                      user: userData.username,
                      identify: overlay.item?.identify || 'http://172.16.0.17/image/erraa/image-00000.jpg',
                    },
                    socket,
                  ),
                );
                dispatch(removeItem(overlay.item.orderCode));
              }
            }}
          />
        </View>
      </Overlay>
    </View>
  );
}
