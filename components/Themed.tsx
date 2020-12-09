import * as React from 'react';
import { KeyboardType, StyleSheet, Animated } from 'react-native';
import { Text as DefaultText, View as DefaultView, Pressable as DefaultPressable, TextInput, FlatList as FlatListDefault, ScrollView as ScrollViewDefault, Switch as DefaultSwitch } from 'react-native';
import { setCustomText, setCustomTextInput } from 'react-native-global-props';
import useColorScheme from '../hooks/useColorScheme';
import Colors, {alertDark, alertLight, errorDark, errorLight, infoDark, infoLight, primaryCrema, primaryDark, primaryGrey, primaryLight, secondaryCrema, secondaryGrey, successDark, successLight} from '../constants/Colors';
import { Link as DefaultLink } from '@react-navigation/native';
import { textInputType } from '../types';
import AppIcons from './AppIcons';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type ScrollViewProps = ThemeProps & ScrollViewDefault['props'];
export type PressableProps = ThemeProps & DefaultPressable.arguments;
export type TextInputProps = ThemeProps & textInputType;
export type LinkProps = ThemeProps & DefaultLink['props'];
export type FlatListProps = ThemeProps & FlatListDefault['props'];
export type SwitchProps = ThemeProps & DefaultSwitch['props'];
export type MessageProps = ThemeProps & DefaultView['props'] & {message:string; type:string;};



export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  return <DefaultText style={[{ color } , style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor}, style]} {...otherProps} />;
}

export function ScrollView(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  return <ScrollViewDefault  bounces={false} contentContainerStyle={[{ backgroundColor}, style]} {...otherProps} showsVerticalScrollIndicator={false}  showsHorizontalScrollIndicator={false} />;
}

export function SwitchView(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'postBackground');

  return <DefaultView style={[{ backgroundColor}, style]} {...otherProps} />;
}

export function Message(props: MessageProps) {
  const { message, type, style, ...otherProps } = props;

  switch(type){
    case `success`:
      return (
        <DefaultView style={[ styles.messageView, styles.successMessage, style]} {...otherProps}>
          <AppIcons size={18} name={`success`} color={successDark}/>
          <Text style={[styles.messageText, styles.successText]}>{message}</Text>
        </DefaultView>
      );
    case `error`:
      return (
        <DefaultView style={[ styles.messageView, styles.errorMessage, style]} {...otherProps}>
          <AppIcons size={18} name={`error`} color={errorDark}/>
          <Text style={[styles.messageText, styles.errorText]}>{message}</Text>
        </DefaultView>
      );
    case `info`:
      return (
        <DefaultView style={[ styles.messageView, styles.infoMessage, style]} {...otherProps}>
          <AppIcons size={18} name={`info`} color={infoDark}/>
          <Text style={[styles.messageText, styles.infoText]}>{message}</Text>
        </DefaultView>
      );
    case `alert`:
      return (
        <DefaultView style={[ styles.messageView, styles.alertMessage, style]} {...otherProps}>
          <AppIcons size={18} name={`alert`} color={alertDark}/>
          <Text style={[styles.messageText, styles.alertText]}>{message}</Text>
        </DefaultView>
      );
  }
}

export function FlatList(props: FlatListProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <FlatListDefault style={[{ backgroundColor}, style]} {...otherProps} />;
}

export function Pressable(props: PressableProps) {
  const { style,  lightColor, darkColor, ...otherProps} = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  return <DefaultPressable style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function PrimaryButton(props: PressableProps) {
  const { disabled, label, style, ...otherProps} = props;
return <DefaultPressable disabled={disabled} style={disabled?[styles.primaryButton,{backgroundColor:useThemeColor({},'header')}, style]:[styles.primaryButton, style]} {...otherProps}><Text style={disabled?[styles.primaryButtonText,{color:useThemeColor({},'tabSelected')}]:styles.primaryButtonText}>{label}</Text></DefaultPressable>;
}

export function SecondaryButton(props: PressableProps) {
  const { disabled, label, style, ...otherProps} = props;
return <DefaultPressable disabled={disabled} style={disabled?[styles.secondaryButton,{backgroundColor:useThemeColor({},'header')}, style]:[styles.secondaryButton, style]} {...otherProps}><Text style={disabled?[styles.secondaryButtonText,{color:useThemeColor({},'tabSelected')}]:styles.secondaryButtonText}>{label}</Text></DefaultPressable>;
}

export function Link(props: LinkProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  return <DefaultLink style={[{ color, textDecorationLine: 'underline'} , style]} {...otherProps} />;
}

export function InputWithLabel(props: TextInputProps) {
  const { style, placeholder = "", label = "", disabled = false, value, callback, type = "none", lightColor, darkColor, keyboardType = "default", isError = false, errMessage = ''} = props;
  const labelColor = useThemeColor({ light: lightColor, dark: darkColor }, 'labelColor');
  const isDisabled = !disabled;
//   const shakeAnimation = new Animated.Value(0);
//   const startShake = () => {
//     Animated.sequence([
//       Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
//       Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
//       Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
//       Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
//     ]).start();
//  }
// isError? [{transform: [{translateX: -50}]}, styles.container, style]:

  return (
    <View style={[ styles.container, style]}>
      {label?<Text style={[{ color: isError? errorDark :labelColor }, styles.label]}>{label}</Text>: null}
      <TextInput style={isError?[{borderColor: errorDark, backgroundColor: errorLight, color:errorDark}]:null} secureTextEntry={type=='password'?true:false} placeholderTextColor={isError? errorDark : primaryGrey} placeholder={placeholder} onChangeText={callback} defaultValue={value} editable={isDisabled} textContentType={type} keyboardType={keyboardType} returnKeyType={"done"}/>
      {isError?<Text style={[{ color: errorDark }, styles.label]}>{errMessage}</Text> :null}
    </View>
  );
}

export function Switch(props: SwitchProps) {
  const { style, lightColor, darkColor, value, ...otherProps } = props;
  const trackColor = useThemeColor({ light: lightColor, dark: darkColor }, 'headerText');
  const thumbColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tabIconSelected');
  return <DefaultSwitch trackColor={{false:trackColor, true:successLight}} thumbColor={value?successDark:thumbColor} value={value} {...otherProps}/>;
}

const customTextInputProps = {
  style: {
    fontSize: 16,
    width: '100%',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    color: primaryDark,
    borderColor: primaryCrema,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: primaryLight,
  },
};
setCustomTextInput(customTextInputProps);

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: primaryDark,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexShrink:1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'center',
    alignSelf:'flex-start',
  },
  secondaryButton: {
    backgroundColor: secondaryGrey,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexShrink:1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'center',
    alignSelf:'flex-start',
  },
  container: {
    width: '100%',
    maxWidth: 280,
  },
  label: {
    fontSize: 12,
    marginLeft: 8,
    marginBottom:4,
  },
  primaryButtonText:{
    color:primaryCrema,
    fontSize:18,
    fontWeight:'600',
  },
  secondaryButtonText:{
    color:primaryDark,
    fontSize:18,
    fontWeight:'600',
  },
  messageView: {
    borderWidth:1,
    borderRadius:8,
    flexShrink:1,
    flexDirection: 'row',
    alignItems:'center',
    marginVertical:8,
    padding: 4,
  },
  messageText:{
    marginLeft: 8,
    fontSize:16,
  },
  successMessage:{
    backgroundColor: successLight,
    borderColor: successDark,
  },
  successText:{
    color: successDark,
  },
  errorMessage:{
    backgroundColor: errorLight,
    borderColor: errorDark,
  },
  errorText:{
    color: errorDark,
  },
  infoMessage:{
    backgroundColor: infoLight,
    borderColor: infoDark,
  },
  infoText:{
    color: infoDark,
  },
  alertMessage:{
    backgroundColor: alertLight,
    borderColor: alertDark,
  },
  alertText:{
    color: alertDark,
  },
});

const customTextProps = {
  style: {
    fontSize: 16,
    fontFamily: 'Poppins',
  },
};
setCustomText(customTextProps);
