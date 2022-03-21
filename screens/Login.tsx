import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useAppDispatch, useAppState } from '../redux/store';
import { Input } from 'react-native-elements';
import { ILoginForm } from '../interfaces/user';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginAsync } from '../redux/auth.slice';

export default function Login() {
  const dispatch = useAppDispatch();
  const validationSchema = yup.object({
    username: yup
      .string()
      .required('ユーザー名を入力してください')
      .min(4, 'ユーザー名の最短は4字')
      .max(20, 'ユーザー名の最長は20字です'),
    password: yup
      .string()
      .required('パスワードを入力してください')
      .min(6, 'パスワードの最短は6字です')
      .max(20, 'パスワードの最長は20字です'),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = (data: ILoginForm) => {
    dispatch(loginAsync(data));
  };
  return (
    <View style={styles.loginForm}>
      {/* Input field for username */}
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            style={{}}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            placeholder="ユーザー名"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="username"
      />

      {errors.username && <Text style={styles.validateError}>{errors.username.message}</Text>}

      {/* Input field for password */}
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            style={{}}
            placeholder="パスワード"
            secureTextEntry={true}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
        name="password"
      />
      {errors.password && <Text style={styles.validateError}>{errors.password.message}</Text>}
      <Button title="ログイン" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  loginForm: {
    position: 'relative',
    top: 100,
    display: 'flex',
    flexDirection: 'column',
  },

  validateError: {
    color: 'red',
  },
});
