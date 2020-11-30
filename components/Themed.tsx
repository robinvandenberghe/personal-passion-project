import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text as DefaultText, View as DefaultView, Pressable as DefaultPressable, TextInput } from 'react-native';
import {
  setCustomText, setCustomTextInput
} from 'react-native-global-props';
import useColorScheme from '../hooks/useColorScheme';
import Colors, {primaryCrema, primaryDark, primaryGrey, primaryLight, secondaryGrey} from '../constants/Colors';
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
export type PressableProps = ThemeProps & DefaultPressable.arguments;
export type TextInputProps = ThemeProps & { placeholder?: string; label?:string; disabled?:boolean; value:string; callback:any; type:any; style?:any};
export type LinkProps = ThemeProps & DefaultLink['props'];

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

export function SwitchView(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'postBackground');

  return <DefaultView style={[{ backgroundColor}, style]} {...otherProps} />;
}

export function Pressable(props: PressableProps) {
  const { style,  lightColor, darkColor, ...otherProps} = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  return <DefaultPressable style={[{ backgroundColor }, styles.button, style]} {...otherProps} />;
}

export function Link(props: LinkProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  return <DefaultLink style={[{ color, textDecorationLine: 'underline'} , style]} {...otherProps} />;
}

export function InputWithLabel(props: TextInputProps) {
  const { style, placeholder = "", label = "", disabled = false, value, callback, type, lightColor, darkColor } = props;
  const labelColor = useThemeColor({ light: lightColor, dark: darkColor }, 'labelColor');
  const isDisabled = !disabled;

  return (
    <View style={[styles.container, style]}>
      {label?<Text style={[{ color: labelColor }, styles.label]}>{label}</Text>: null}
      <TextInput placeholderTextColor={primaryGrey} placeholder={placeholder}  onChangeText={callback}  defaultValue={value} editable={isDisabled} secureTextEntry={type=="password"? true : false} textContentType={type}/>
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
  button: {
    backgroundColor: primaryDark,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex:1,
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
});

const customTextProps = {
  style: {
    fontSize: 16,
    fontFamily: 'Poppins',
  },
};
setCustomText(customTextProps);
