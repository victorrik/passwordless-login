import React, { useRef, useState } from 'react';
import {
	Alert,
	Dimensions,
	Modal,
	StyleSheet,
	Text,
	TextInput,
	View,
	ViewProps
} from 'react-native';
import { Button, Icons } from '@components'; 
import { ButtonRef } from '@PasswordLess/components/Button'; 
import useCredentialsStore from '@PasswordLess/store/useCredentialStore';
import { getAuthPhone, linkCredential, listProviders, signWithPhone } from '@firebase/auth';

const SCREEN_WIDTH = Math.round(Dimensions.get('window').width)

const CardModal = ({ children, style }: ViewProps) => {
	return (
		<View style={[styles.modalCard, style]} >
			{children}
		</View>
	)
}

const phoneAuthProvider = getAuthPhone()  
const ButtonPhoneNumber = ({checkCurrentUser}:{checkCurrentUser:()=>void}) => {
	const confirmationMetodhRef = useRef<any>(null)
	const btnSendCodeRef = useRef<ButtonRef>(null)
	const btnCheckCodeRef = useRef<ButtonRef>(null)
	const btnPhone = useRef<ButtonRef>(null)
	const [phoneNumber, setPhoneNumber] = useState("")
	const [readyForCode, setReadyForCode] = useState(false);
	const [code, setCode] = useState('');
	const [showInputModal, setShowInputModal] = useState(false);

	const credentialsStore = useCredentialsStore()
	//console.log('credentialStore', credentialStore)

	const initPhoneLogin = async () => {

		if (phoneNumber.length < 10) {
			Alert.alert("Escriba un numbero valido de 10 digitos")
			return
		}
		btnSendCodeRef.current?.handleLoading(true)
		const confirmation = await signWithPhone(`+52${phoneNumber}`);
		confirmationMetodhRef.current = confirmation;
		setReadyForCode(true)
		btnSendCodeRef.current?.handleLoading(false)
		btnCheckCodeRef.current?.handleLoading(false)
	}
	const checkCode = async () => {
		btnCheckCodeRef.current?.handleLoading(true)
		
		const providers = listProviders()
		if (providers) {
			Alert.alert(
				"Conectar metodo",
				"Ha iniciado sesión con otro metodo, ¿le gustaria vincular?",
				[
					{text:"No",
					onPress:()=>null
					},
					{text:"Si",
					onPress:()=>connectAccounts()
					}
				]
			)
			return
		}
		try {
			await confirmationMetodhRef.current.confirm(code);
			checkCurrentUser()
			cancelProcess()
		} catch (error) {
			console.log('Invalid code.', error);
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
	const connectAccounts = async() => { 
		const credential = phoneAuthProvider.credential(confirmationMetodhRef.current.verificationId, code);
		credentialsStore.add(credential)
		await linkCredential(credential);
		checkCurrentUser()
		cancelProcess()
	}
	const loggedIn = credentialsStore.providers.some(({providerId})=> providerId === "phone"); 
	return (
		<>
			<Modal
				animationType="slide"
				transparent={true}
				visible={showInputModal}
				//onRequestClose={() => {setShowInputModal(false)}}
			>
				<View style={styles.modalBack} >
					<CardModal>
						<View style={{ marginBottom: 16, flexDirection: 'row', justifyContent: "flex-end" }} >
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
			</Modal>
			<Button
				ref={btnPhone}
				disabled={loggedIn}
				title='SMS'
				onPress={() => {
					btnPhone.current?.handleLoading(true)
					setShowInputModal(true)
				}}
				btnStyle={{ backgroundColor:loggedIn?"gray":"white" }}
				txtStyle={{ color:loggedIn?"white":"black", fontSize: 18, fontWeight: "bold" }}
				highlight={loggedIn?"white":"black"}
				icon="phone"
				iconRigth
			/>
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
	iconUser: {
		width: SCREEN_WIDTH * 0.35,
		height: SCREEN_WIDTH * 0.35,
		backgroundColor: 'gold',
		borderRadius: 999,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16
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
		minHeight: 40,
	},
	modalBack: {
		flex:1,
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

export default ButtonPhoneNumber;
