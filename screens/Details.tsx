import { View, Text, Image, FlatList, Alert } from 'react-native';
import React from 'react';
import { Button, Card, ListItem } from 'react-native-elements';
import { useAppDispatch, useAppState } from '../redux/store';
import { IItem } from '../interfaces/prepareItem';
import { removeItem } from '../redux/prepareList.slice';

export default function Details() {
  const { prepareList } = useAppState((state) => state);
  const dispatch = useAppDispatch();
  const card = ({ item }: { item: IItem }) => (
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
              width: 100,
              marginHorizontal: 50,
              marginVertical: 15,
            }}
            onPress={() =>
              Alert.alert('アイテム削除', `${item.orderCode}というアイテムを削除しますか？`, [
                {
                  text: 'キャンセル',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: '確認',
                  onPress: () => {
                    dispatch(removeItem(item.orderCode));
                    console.log('OK Pressed');
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
              width: 100,
              marginHorizontal: 50,
              marginVertical: 15,
            }}
          />
        </View>
      </View>
    </Card>
  );
  return (
    <View>
      <FlatList
        style={{ marginVertical: 10 }}
        data={prepareList}
        renderItem={card}
        keyExtractor={(item) => item.orderCode}
      ></FlatList>
    </View>
  );
}
