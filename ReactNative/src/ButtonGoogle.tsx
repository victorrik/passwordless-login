/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useRef, useState } from 'react';
import {
	Alert, 
} from 'react-native';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Button } from '@components';
import { fetchEmailMethods, getAuthGoogle, signWithCredentials } from '@firebase/auth'; 
import { ButtonRef } from '@PasswordLess/components/Button';
 

const googleAuthProvider = getAuthGoogle()  
const ButtonGoogle = ({checkCurrentUser}:{checkCurrentUser:()=>void}) => { 
	const btnGoogle = useRef<ButtonRef>(null) 
	const [accessToken, setAccessToken] = useState<any>();

	const initGoogleLogin = async () => {
		 // Check if your device supports Google Play
		 GoogleSignin.configure({
			scopes: [], // what API you want to access on behalf of the user, default is email and profile
			webClientId: '980982636933-eksco1tqqp0b49cf5h18nm3o8e23i5lo.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
			offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
			hostedDomain: '', // specifies a hosted domain restriction
			forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
			accountName: '', // [Android] specifies an account name on the device that should be used
			iosClientId: '980982636933-tl31gsdc5kmeasstrcaj55iairb9csre.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
			googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
			openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
			profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
		});
		 try {
				await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
		 } catch (error) {
			console.log('hasPlayServices',error)
		 }
		 let idTokenV
		 // Get the users ID token
		 try {
			const { idToken } = await GoogleSignin.signIn();
			idTokenV = idToken
		 } catch (error) {
			console.log('signIn',error)
		 }
	 
		 try {
			 // Create a Google credential with the token
			 //@ts-ignore
			const googleCredential = googleAuthProvider.credential(idTokenV);
	 
		 // Sign-in the user with the credential
		 	await signWithCredentials(googleCredential);
			checkCurrentUser()
		 } catch (error) {
			console.log("---",error)
		 }
	}

	const connectGoogle = async(accessToken:string,credential:any) => {
		
	}
 
	return (
		<Button
			ref={btnGoogle}
			title='Google'
			onPress={initGoogleLogin}
			btnStyle={{ backgroundColor: "#e94235" }}
			txtStyle={{ fontSize: 18, fontWeight: "bold" }}
			icon="google"
			iconRigth
		/>
	);
};
 
export default ButtonGoogle;
