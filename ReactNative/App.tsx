/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
import {
	Alert,
	Dimensions,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	View,
	ViewProps,
	useColorScheme
} from 'react-native';
import auth  from '@react-native-firebase/auth'
import { LoginManager, Settings, AccessToken } from 'react-native-fbsdk-next';
import { Button, Icons } from '@components';
import { checkExistence } from '@firebase/auth';
import { UserType } from '@PasswordLessTypes';
import { ButtonRef } from '@PasswordLess/components/Button';
import ButtonFacebook from '@PasswordLess/ButtonFacebook';
import ButtonGoogle from '@PasswordLess/ButtonGoogle';

Settings.initializeSDK();

const SCREEN_HEIGHT = Math.round(Dimensions.get('window').height)
const SCREEN_WIDTH = Math.round(Dimensions.get('window').width)

const CardModal = ({ children, style }: ViewProps) => {
	return (
		<View style={[styles.modalCard, style]} >
			{children}
		</View>
	)
}


const App = () => {
	const colors = useColorScheme()
	const confirmationMetodhRef = useRef<any>(null)
	const btnSendCodeRef = useRef<ButtonRef>(null)
	const btnCheckCodeRef = useRef<ButtonRef>(null)
	const btnFacebook = useRef<ButtonRef>(null) 
	const btnPhone = useRef<ButtonRef>(null)
	const [userData, setUserData] = useState<UserType>();
	const [phoneNumber, setPhoneNumber] = useState("")
	const [readyForCode, setReadyForCode] = useState(false);
	const [code, setCode] = useState('');
	const [showInputModal, setShowInputModal] = useState(false);

	useEffect(() => {
		checkCurrentUser()
	}, [])

	const checkCurrentUser = async () => {
		let userExistence = await checkExistence()
		if (userExistence) {
			setUserData(userExistence)
		}
	}  

	const initPhoneLogin = async() => {
		
		if (phoneNumber.length < 10) {
			Alert.alert("Escriba un numbero valido de 10 digitos")
			return
		}
		btnSendCodeRef.current?.handleLoading(true)
    try {
			const confirmation = await auth().signInWithPhoneNumber(`+52${phoneNumber}`);
			confirmationMetodhRef.current = confirmation;
			setReadyForCode(true);
		} catch (error) {
			console.log("signInWithPhoneNumber",error)	
			cancelProcess()
		}
		btnSendCodeRef.current?.handleLoading(false)
		btnCheckCodeRef.current?.handleLoading(false)
		
	}
	const checkCode = async() => { 
		btnCheckCodeRef.current?.handleLoading(true)
		try {
      await confirmationMetodhRef.current.confirm(code);
			checkCurrentUser()
			cancelProcess()
    } catch (error) {
      console.log('Invalid code.',error);
    }
		btnCheckCodeRef.current?.handleLoading(false)
	}
	const cancelProcess = () => {
		setReadyForCode(false)
		btnPhone.current?.handleLoading(false)
		setShowInputModal(false)
		setPhoneNumber("")
		setCode("")
		btnSendCodeRef.current?.handleLoading(false)
		btnCheckCodeRef.current?.handleLoading(false)
	}
	const colorText = colors === "dark" ? "white" : "black";
	return (
		<>
			{showInputModal &&
				<View style={styles.modalBack} >
					<CardModal>
						<View style={{marginBottom: 16, flexDirection: 'row', justifyContent: "flex-end" }} >
							<Icons size={20} color='red' name='xlg' onPress={cancelProcess} />
						</View>
						{readyForCode ?
							<React.Fragment key="21">
								<Text>Introduza el codigo</Text>
								<TextInput 
									value={code}
									keyboardType="decimal-pad"
									onChangeText={value => setCode(value)}
									style={styles.input}
									placeholder='######'
								/>
								<Button
									ref={btnCheckCodeRef}
									title='Validar codigo'
									onPress={checkCode}
								/>
							</React.Fragment> :
							<React.Fragment key="5a">
								<Text>Escriba su número de teléfono</Text>
								<TextInput
									value={phoneNumber}
									keyboardType="decimal-pad"
									onChangeText={value => setPhoneNumber(value)}
									style={styles.input}
									placeholder='777 777 777'
								/>
								<Button
									ref={btnSendCodeRef}
									title='Enviar codigo'
									onPress={initPhoneLogin}
								/>
							</React.Fragment>
						}

					</CardModal>
				</View>
			}
			<SafeAreaView style={styles.container}>

				<View
					style={styles.scrollContainer}
				>
					{userData &&
						<View style={styles.userContainer} >
							{userData.photoURL && userData.photoURL.length ?
								<Image style={styles.photo} source={{ uri: userData.photoURL }} /> :
								<View style={styles.iconUser} >
									<Icons size={50} name="personbadge" />
								</View>
							}
							<Text style={[styles.waving, { color: colorText }]} >Hola <Text style={styles.displayName} >{userData.displayName}</Text></Text>
							<Text>Has iniciado sesión con:</Text>
							<View>
								{userData.providerData.map((obj:any,index:number)=>
									<View key={index+""} >
										<Text style={[styles.waving, { color: colorText }]} >
											{obj.providerId}
										</Text>
									</View>
								)}
							</View>
						</View>
					}
					<Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 16, color: colorText }} >
						¿Como te gustaria <Text style={{ fontWeight: "bold" }} >iniciar sesión</Text>?
					</Text>
					<View style={{ flexDirection: "column" }} >
						<ButtonFacebook checkCurrentUser={checkCurrentUser} />
						<View style={{ height: 20 }} />
						<ButtonGoogle checkCurrentUser={checkCurrentUser} />
						<View style={{ height: 20 }} />
						<Button
							ref={btnPhone}
							title='SMS'
							onPress={()=>{
								btnPhone.current?.handleLoading(true)
								setShowInputModal(true)
							}}
							btnStyle={{ backgroundColor: "white" }}
							txtStyle={{ color: "black", fontSize: 18, fontWeight: "bold" }}
							highlight="black"
							icon="phone"
							iconRigth
						/>
					</View>

				</View>
			</SafeAreaView>
		</>

	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: "relative"
	},
	scrollContainer: {
		padding: 24
	},
	userContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16
	},
	photo: {
		width: SCREEN_WIDTH * 0.35,
		height: SCREEN_WIDTH * 0.35,
		borderRadius: 100,
		marginBottom: 16
	},
	iconUser:{
		width: SCREEN_WIDTH * 0.35,
		height: SCREEN_WIDTH * 0.35, 
		backgroundColor: 'gold',
		borderRadius:999, 
		justifyContent:'center',
		alignItems:'center',
		marginBottom:16
	},
	waving: {
		fontSize: 18,
		textAlign: "center"
	},
	displayName: {
		fontWeight: "bold"
	},
	input: {
		fontWeight: "bold",
		fontSize: 16,
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 6,
		marginBottom: 16,
		minHeight:40,
	},
	modalBack: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		zIndex: 2,
		elevation: 1
	},
	modalCard: {
		backgroundColor: 'white',
		borderRadius: 8,
		padding: 24,
		width: '85%',
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 11,
		},
		shadowOpacity: 0.55,
		shadowRadius: 14.78,
		elevation: 22,
	}
});

export default App;
