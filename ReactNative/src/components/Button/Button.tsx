import React, { forwardRef, useImperativeHandle, useState } from 'react'
import {
	ActivityIndicator,
	GestureResponderEvent,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import Icons from '../Icons/Icons';
import { ButtonProps, ButtonRef } from '.';



/**
 * Componente de tipo boton
 * El texto de boton viene del componente Fonts y tiene su propio estilo
 * @param param0 
 * @param ref 
 * @returns 
 */
function PatitoButton({
	disabled,
	title = "Dira algo el boton",
	activeOpacity = 0.5,
	containerStyle,
	btnStyle,
	txtStyle,
	onPress,
	icon,
	iconRigth,
	highlight = "#FFF"
}: ButtonProps, ref: React.Ref<ButtonRef> | undefined) {
	//Estado para que se muestre actividad de carga
	const [loading, setLoading] = useState(false);
	//Hook para hacr un functional component tenga ref, contiene el cambio de estado de carga
	useImperativeHandle(ref, () => ({
		handleLoading: handleLoading
	}), []);
	//funcion para manejar el cambio de estado de carga del boton
	const handleLoading = (b: boolean | ((prevState: boolean) => boolean)) => {
		setLoading(b);
	}
	//Funcion para manejar cuando se presiona el boton
	const handlePress = (e: GestureResponderEvent | undefined) => {
		if (onPress) { onPress(e) }
	}
	//Colores con base al tipo de boton y su estado como disabled o activo


	return (
		<TouchableOpacity disabled={disabled  } style={containerStyle} onPress={handlePress} activeOpacity={activeOpacity} >
	 
			<View style={[styles.btnGeneral, btnStyle]} >

				{(icon && !iconRigth) ? 
				<View style={{marginRight:10}} >
					<Icons size={20} color={highlight} name={icon} />
				</View>
				 : null}
				<Text style={[{fontSize:16, color: highlight }, txtStyle]}  >{title}</Text>
				{(icon && iconRigth) ? 
				<View style={{marginLeft:10}} >
					<Icons size={20} color={highlight} name={icon} />
				</View>
				 : null}
			</View>
		</TouchableOpacity>
	)
}
const Button = forwardRef(PatitoButton);

export default Button

const styles: any = StyleSheet.create({
	btnGeneral: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		minHeight: 48,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 4,
		position: 'relative',
		backgroundColor: "#286b7c",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	floatingLoading: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 6,
		zIndex: 2,
	},
	txtDisabled: {
		color: "white"
	}
});