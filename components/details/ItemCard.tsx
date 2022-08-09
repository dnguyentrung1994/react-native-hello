import { View, Text, Animated, Image } from 'react-native';
import React, { FC } from 'react';
import { IItem } from '../../interfaces/prepareItem';
import { Button, Card } from 'react-native-elements';
import { useAppState } from '../../redux/store';

type PropTypes = {
  item: IItem;
};
const ItemCard: FC<PropTypes> = ({ item }) => {
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
  const completed = () => {
    Animated.sequence([
      Animated.timing(completedAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };
  return (
    <View>
      <Animated.View style={[CompletedAnimatedStyle, FadingAnimatedStyle]}>
        <Card>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
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
            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Button
                title="分割"
                loading={false}
                loadingProps={{ size: 'small', color: 'white' }}
                icon={{
                  name: 'garage-alert-variant',
                  type: 'material-community',
                  size: 15,
                  color: 'white',
                }}
                buttonStyle={{
                  backgroundColor: 'orange',
                  borderRadius: 10,
                }}
                containerStyle={{
                  minWidth: 80,
                  marginHorizontal: 40,
                  marginVertical: 15,
                }}
              />
            </View>
          </View>
        </Card>
      </Animated.View>
    </View>
  );
};

export default ItemCard;
