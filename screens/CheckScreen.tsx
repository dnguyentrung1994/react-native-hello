import { View, Text, FlatList, Image, Alert, Animated, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppState } from '../redux/store';
import { Button, ButtonGroup, Card, Divider, ListItem, Overlay } from 'react-native-elements';
import { IShipment } from '../interfaces/shipments';
import { LinearGradient } from 'expo-linear-gradient';
import {
  cancelCheckShipment,
  cancelMyShipment,
  confirmShipment,
  registerCheckShipment,
} from '../redux/shipments.slice';

interface IReason {
  title: string;
  subTitle: string;
  checked: boolean;
}
export default function CheckScreen() {
  const { myShipments, otherShipments, checking } = useAppState((state) => state.shipmentsSlice);
  const { socket } = useAppState((state) => state.socketSlice);
  const dispatch = useAppDispatch();

  const [tabIndex, setTabIndex] = useState(0);
  const [disableGroup, setDisableGroup] = useState<number[]>([]);
  const [displayOverlay, setDisplayOverlay] = useState<boolean>(false);
  const [customReason, setCustomReason] = useState<string>('');
  const initialReasonList: IReason[] = [
    {
      title: '数量不一致',
      subTitle: '数量不足、数量超える等',
      checked: false,
    },
    {
      title: '外観不良',
      subTitle: 'スパッタ、絆等',
      checked: false,
    },
    {
      title: '出庫準備不良',
      subTitle: 'マーキング不正、リタップ忘れ等',
      checked: false,
    },
    {
      title: 'その他',
      subTitle: 'リスト以外の理由',
      checked: false,
    },
  ];
  const [reasonList, setReasonList] = useState<IReason[]>(initialReasonList);

  const toggleReasonLists = (toggleIndex: number) => {
    const newReasonList: IReason[] = [...reasonList].map((reason, index) =>
      index === toggleIndex ? { ...reason, checked: !reason.checked } : reason,
    );
    setReasonList(newReasonList);
  };

  const resetReasonLists = () => {
    setDisplayOverlay(false);
    setReasonList(initialReasonList);
  };

  const reportFailedShipment = () => {
    const reasons: string[] = reasonList
      .filter((reason) => reason.checked === true)
      .map((reason) => (reason.title === 'その他' ? customReason : reason.title));
    if (checking?.id !== undefined && reasons.length !== 0) dispatch(confirmShipment(checking?.id, socket, reasons));
  };
  const checkingItemAnimation = new Animated.Value(checking ? 1 : 0);
  const CheckingItem = {
    opacity: checkingItemAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    height: checkingItemAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 220],
    }),
  };
  const displayCheckingItem = () => {
    Animated.timing(checkingItemAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  const hideCheckingItem = () => {
    Animated.timing(checkingItemAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => setCustomReason(''), [reasonList[reasonList.length - 1].checked]);

  useEffect(() => {
    const newState = [];
    if (otherShipments.length === 0 || checking !== undefined) {
      setTabIndex(1);
      newState.push(0);
    }
    if (myShipments.length === 0) newState.push(1);
    setDisableGroup(newState);
  }, [myShipments, otherShipments]);

  const ItemCard = ({ item }: { item: IShipment }) => {
    const fadingAnimation = new Animated.Value(1);
    const FadingStyle = {
      opacity: fadingAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      height: fadingAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200],
      }),
    };
    const fadeOut = () => {
      Animated.timing(fadingAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    };
    const checkingStyle = item.checkedBy
      ? {
          backgroundColor: 'rgba(251, 214, 121, 1)',
        }
      : {
          backgroundColor: 'white',
        };
    return (
      <View>
        <Animated.View style={FadingStyle}>
          <Card containerStyle={checkingStyle}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Image style={{ width: 225, height: 150 }} source={{ uri: item.identify }} />
              <View style={{ paddingLeft: 10 }}>
                <Text>
                  製品番号：　<Text style={{ fontWeight: 'bold' }}>{item.productCode}</Text>
                </Text>
                <Text>
                  数量：　<Text style={{ fontWeight: 'bold' }}>{item.quantity}</Text>
                </Text>
                {tabIndex === 0 && (
                  <Text>
                    処理買:　<Text style={{ fontWeight: 'bold' }}>{item.preparedBy}</Text>
                  </Text>
                )}
                <Text>終了瞬間:　</Text>
                <Text style={{ fontWeight: 'bold', marginLeft: 20 }}>{item.preparedTime}</Text>
                {item.checkedBy && (
                  <Text>
                    確認買:　<Text style={{ fontWeight: 'bold' }}>{item.checkedBy}</Text>
                  </Text>
                )}
              </View>

              {tabIndex === 0 ? (
                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Button
                    title="チェック"
                    disabled={item.checkedBy !== undefined}
                    loading={false}
                    loadingProps={{ size: 'small', color: 'white' }}
                    icon={{
                      name: 'library-add-check',
                      type: 'material',
                      size: 15,
                      color: 'white',
                    }}
                    buttonStyle={{
                      backgroundColor: 'blue',
                      borderRadius: 10,
                    }}
                    containerStyle={{
                      width: 100,
                      marginHorizontal: 20,
                    }}
                    onPress={() =>
                      Alert.alert('アイテム確認', `${item.orderCode}をチェックしますか？`, [
                        {
                          text: 'キャンセル',
                          style: 'cancel',
                        },
                        {
                          text: '始まる',
                          onPress: async () => {
                            fadeOut();
                            await new Promise((r) => setTimeout(r, 300));
                            setTabIndex(1);
                            dispatch(registerCheckShipment(item.id, socket));
                            displayCheckingItem();
                          },
                        },
                      ])
                    }
                  />
                </View>
              ) : (
                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Button
                    title="削除"
                    disabled={item.checkedBy !== undefined}
                    loading={false}
                    loadingProps={{ size: 'small', color: 'white' }}
                    icon={{
                      name: 'cancel-schedule-send',
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
                    }}
                    onPress={() => dispatch(cancelMyShipment(item.id, socket))}
                  />
                </View>
              )}
            </View>
          </Card>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={{ marginBottom: 70 }}>
      {checking && (
        <Animated.View style={CheckingItem}>
          <LinearGradient
            colors={['rgba(251, 214, 121, 0.5)', 'rgba(251, 214, 121, 1)']}
            style={{ paddingVertical: 5 }}
          >
            <Card>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Image style={{ width: 225, height: 150 }} source={{ uri: checking.identify }} />
                <View style={{ paddingLeft: 10 }}>
                  <Text>
                    製品番号：　<Text style={{ fontWeight: 'bold' }}>{checking.productCode}</Text>
                  </Text>
                  <Text>
                    数量：　<Text style={{ fontWeight: 'bold' }}>{checking.quantity}</Text>
                  </Text>

                  <Text>
                    処理買:　<Text style={{ fontWeight: 'bold' }}>{checking.preparedBy}</Text>
                  </Text>

                  <Text>終了瞬間:　</Text>
                  <Text style={{ fontWeight: 'bold', marginLeft: 20 }}>{checking.preparedTime}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Button
                    title="OK"
                    loading={false}
                    loadingProps={{ size: 'small', color: 'white' }}
                    icon={{
                      name: 'thumb-up',
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
                      marginVertical: 5,
                    }}
                    onPress={() => dispatch(confirmShipment(checking.id, socket))}
                  />
                  <Button
                    title="NG"
                    loading={false}
                    loadingProps={{ size: 'small', color: 'white' }}
                    icon={{
                      name: 'thumb-down',
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
                      marginVertical: 5,
                    }}
                    onPress={() => setDisplayOverlay(true)}
                  />
                  <Button
                    title="戻る"
                    loading={false}
                    loadingProps={{ size: 'small', color: 'white' }}
                    icon={{
                      name: 'backspace',
                      type: 'material-community',
                      size: 15,
                      color: 'white',
                    }}
                    buttonStyle={{
                      backgroundColor: 'black',
                      borderRadius: 10,
                    }}
                    containerStyle={{
                      width: 80,
                      marginHorizontal: 40,
                      marginVertical: 5,
                    }}
                    onPress={async () => {
                      hideCheckingItem();
                      await new Promise((r) => setTimeout(r, 500));
                      dispatch(cancelCheckShipment(checking.id, socket));
                      if (otherShipments.length !== 0) setTabIndex(0);
                    }}
                  />
                </View>
              </View>
            </Card>
          </LinearGradient>
        </Animated.View>
      )}
      <View>
        <ButtonGroup
          buttons={['他の', '自分の']}
          disabled={disableGroup}
          selectedIndex={tabIndex}
          onPress={(value) => {
            setTabIndex(value);
          }}
        />
      </View>
      <FlatList
        style={{ marginVertical: 10 }}
        data={tabIndex === 0 ? otherShipments : myShipments}
        renderItem={ItemCard}
        keyExtractor={(item) => item.orderCode}
      ></FlatList>
      <Overlay isVisible={displayOverlay} onBackdropPress={resetReasonLists} overlayStyle={{ width: '90%' }}>
        <View style={{ display: 'flex', flexDirection: 'column' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>不良シップメント報告</Text>
          <Divider style={{ marginBottom: 10 }} />
        </View>

        <View style={{ display: 'flex', flexDirection: 'column' }}>
          <Text style={{ fontSize: 16, fontWeight: 'normal' }}>以下の中から1つ以上お選びください（複数選択可）。</Text>
          {reasonList.map((reason, index) => (
            <ListItem key={index} onPress={() => toggleReasonLists(index)} bottomDivider>
              <ListItem.CheckBox center checked={reason.checked} />
              <ListItem.Content>
                <ListItem.Title>{reason.title}</ListItem.Title>
                <ListItem.Subtitle>{reason.subTitle}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))}
          <Divider style={{ marginBottom: 10 }} />
        </View>
        {reasonList[reasonList.length - 1].checked && (
          <View>
            <Text style={{ fontSize: 16, fontWeight: 'normal', paddingBottom: 5 }}>「その他」というのは:　 </Text>
            <TextInput
              style={{ borderColor: 'black', borderBottomWidth: 1, minWidth: 50, marginLeft: 10 }}
              value={customReason}
              onChangeText={setCustomReason}
              placeholder="理由を入力してください"
            />
            <Divider style={{ marginBottom: 10 }} />
          </View>
        )}
        <View style={{ display: 'flex', flexDirection: 'row-reverse' }}>
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
            }}
            containerStyle={{
              width: 80,
              marginVertical: 15,
              marginHorizontal: 10,
            }}
            onPress={reportFailedShipment}
          />
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
            }}
            containerStyle={{
              width: 120,
              marginVertical: 15,
              marginHorizontal: 10,
            }}
            onPress={resetReasonLists}
          />
        </View>
      </Overlay>
    </View>
  );
}
