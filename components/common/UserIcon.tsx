import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAppState } from '../../redux/store';

const UserIcon = () => {
  const navigation = useNavigation();
  const { avatar, fullname } = useAppState((state) => state.auth.userData);
  return (
    <View style={styles.avatar}>
      <TouchableOpacity style={styles.displayArea} onPress={() => navigation.goBack()}>
        <Text style={styles.fullName}>{fullname}</Text>
        <Avatar
          size={32}
          source={{
            uri: avatar
              ? avatar
              : 'https://us.123rf.com/450wm/thesomeday123/thesomeday1231712/thesomeday123171200009/91087331-default-avatar-profile-icon-for-male-grey-photo-placeholder-illustrations-vector.jpg?ver=6',
          }}
          rounded
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginRight: 10,
  },

  displayArea: {
    display: 'flex',
    flexDirection: 'row',
  },

  fullName: {
    marginRight: 10,
  },
});

export default UserIcon;
