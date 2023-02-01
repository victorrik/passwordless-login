
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { IconsAvailable } from '../Icons';

export type ButtonProps = { 
	disabled?: boolean ;
	type?: "primary"|"secondary"|"tertiary" ;
	highlight?: string;
	title: string ;
	activeOpacity?: number ;
	containerStyle?:StyleProp<ViewStyle> ;
	btnStyle?:StyleProp<ViewStyle>;
	txtStyle?:StyleProp<TextStyle> ;
	onPress:any;
	icon?:IconsAvailable,
	iconRigth?:boolean
}
export type ButtonRef = {
	handleLoading:(b:boolean)=>void
}
export {default} from './Button';