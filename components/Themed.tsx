import * as React from 'react';
import { KeyboardType, StyleSheet } from 'react-native';
import { Text as DefaultText, View as DefaultView, Pressable as DefaultPressable, TextInput, FlatList as FlatListDefault, ScrollView as ScrollViewDefault } from 'react-native';
import {
  setCustomText, setCustomTextInput
} from 'react-native-global-props';
import useColorScheme from '../hooks/useColorScheme';
import Colors, {primaryCrema, primaryDark, primaryGrey, primaryLight, secondaryCrema, secondaryGrey} from '../constants/Colors';
import { Link as DefaultLink } from '@react-navigation/native';


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
export type TextInputProps = ThemeProps & { placeholder?: string; label?:string; disabled?:boolean; value:string; callback:any; type?:any; style?:any; keyboardType?:KeyboardType};
export type LinkProps = ThemeProps & DefaultLink['props'];
export type FlatListProps = ThemeProps & FlatListDefault['props'];


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
  return <ScrollViewDefault style={[{ backgroundColor}, style]} {...otherProps} />;
}

export function SwitchView(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'postBackground');

  return <DefaultView style={[{ backgroundColor}, style]} {...otherProps} />;
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
  const { style, placeholder = "", label = "", disabled = false, value, callback, type = "none", lightColor, darkColor, keyboardType = "default"} = props;
  const labelColor = useThemeColor({ light: lightColor, dark: darkColor }, 'labelColor');
  const isDisabled = !disabled;

  return (
    <View style={[styles.container, style]}>
      {label?<Text style={[{ color: labelColor }, styles.label]}>{label}</Text>: null}
      <TextInput placeholderTextColor={primaryGrey} placeholder={placeholder}  onChangeText={callback}  defaultValue={value} editable={isDisabled} secureTextEntry={type=="password"? true : false} textContentType={type} keyboardType={keyboardType} returnKeyType={"done"}/>
    </View>
  );
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
});

const customTextProps = {
  style: {
    fontSize: 16,
    fontFamily: 'Poppins',
  },
};
setCustomText(customTextProps);
