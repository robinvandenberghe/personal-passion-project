import React, {useState} from 'react';
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import QRCode from 'react-native-qrcode-svg';
import useColorScheme from '../hooks/useColorScheme';
import { Text, View } from '../components/Themed';
import { useGlobalState } from '../state';

export default function QRScreen() {
  const [user, setUser] = useGlobalState('user');
  const colorScheme = useColorScheme();
  return (
    <View style={styles.container}>
      {user.uid? <QRCode size={280} logo={require('./../assets/images/qrKalf.png')} logoSize={60} logoBackgroundColor={Colors[colorScheme].background} logoMargin={4} value={user.uid} backgroundColor='transparent' color={Colors[colorScheme].text}/> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
