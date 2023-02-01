/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useRef } from 'react';
import {
	Alert,
} from 'react-native';
import {
	GoogleSignin,
} from '@react-native-google-signin/google-signin';
import { Button } from '@components';
import { getAuthGoogle, linkCredential, listProviders, signWithCredentials } from '@firebase/auth';
import { ButtonRef } from '@PasswordLess/components/Button';
import useCredentialsStore from './store/useCredentialStore';


const googleAuthProvider = getAuthGoogle()
const ButtonGoogle = ({ checkCurrentUser }: { checkCurrentUser: () => void }) => {
	const btnGoogle = useRef<ButtonRef>(null)
	const credentialsStore = useCredentialsStore()

	const initGoogleLogin = async () => {
		// Check if your device supports Google Play
		GoogleSignin.configure({
			scopes: [], // what API you want to access on behalf of the user, default is email and profile
			webClientId: '980982636933-eksco1tqqp0b49cf5h18nm3o8e23i5lo.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
			offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
			forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
			iosClientId: '980982636933-tl31gsdc5kmeasstrcaj55iairb9csre.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
			profileImageSize: 500, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
		});

		try {
			await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
		} catch (error) {
			console.log('hasPlayServices', error)
		}
		let idTokenV
		// Get the users ID token
		try {
			const { idToken } = await GoogleSignin.signIn();
			idTokenV = idToken;
		} catch (error) {
			console.log('signIn', error)
		}

		//@ts-ignore
		const googleCredential = googleAuthProvider.credential(idTokenV);
		credentialsStore.add(googleCredential)
		const providers = listProviders()
		if (providers) {
			Alert.alert(
				"Correo en uso",
				"Ya se ha registrado/iniciado sesion con el correo asociado a la cuenta ¿le gustaria vincularla?",
				[
					{text:"No",
					onPress:()=>null
					},
					{text:"Si",
					onPress:()=>connectGoogle(googleCredential)
					}
				]
			)
			return
		}
		let sign = await signWithCredentials(googleCredential);
		if (!sign) {
			Alert.alert("Ocurrio un problema al registraro", sign)
			btnGoogle.current?.handleLoading(false)
			return
		}
		checkCurrentUser()
		
	}

	const connectGoogle = async (credential: any) => {
		await linkCredential(credential);
		checkCurrentUser()
	}
	
	const loggedIn = credentialsStore.providers.some(({providerId})=> providerId === "google.com"); 
	return (
		<>
			{/* <Button
				title='Extra '
				containerStyle={{ marginBottom: 16 }}
				btnStyle={{ backgroundColor: "#e94235" }}
				txtStyle={{ fontSize: 18, fontWeight: "bold" }}
				onPress={() => null}
			/> */}
			<Button
				disabled={loggedIn}
				ref={btnGoogle}
				title='Google'
				onPress={initGoogleLogin}
				btnStyle={{ backgroundColor: loggedIn ? "gray" : "#e94235" }}
				txtStyle={{ fontSize: 18, fontWeight: "bold" }}
				icon="google"
				iconRigth
			/>
		</>

	);
};

export default ButtonGoogle;
