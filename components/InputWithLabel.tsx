import * as React from 'react';
import { Text, View, TextInput, StyleSheet } from "react-native";
import {primaryCrema, primaryDark, secondaryGrey} from '../constants/Colors';


export default function InputWithLabel({ placeholder = "", label = "", disabled = false, value, callback, type}: { placeholder?: string; label?:string; disabled?:boolean; value:string; callback:any; type:any}) {
  disabled = !disabled;
  return (
    <View style={styles.container}>
      {label?<Text style={styles.label}>{label}</Text>: null}
      <TextInput style={styles.input} placeholder={placeholder}  onChangeText={callback}  defaultValue={value} editable={disabled} secureTextEntry={type=="password"? true : false} textContentType={type}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 280,
  },
  input: {
    width: '100%',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    color: primaryDark,
    borderColor: primaryCrema,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  label: {
    fontSize: 12,
    color: secondaryGrey,
    marginLeft: 8,
    marginBottom:4,
  },
});
