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

import { LoginManager, Settings, AccessToken,GraphRequest, GraphRequestManager } from 'react-native-fbsdk-next';
import { Button } from '@components';
import { fetchEmailMethods, getAuthFacebook, signWithCredentials } from '@firebase/auth'; 
import { ButtonRef } from '@PasswordLess/components/Button';

Settings.initializeSDK();

const facebookAuthProvider = getAuthFacebook()  
const ButtonFacebook = ({checkCurrentUser}:{checkCurrentUser:()=>void}) => { 
	const btnFacebook = useRef<ButtonRef>(null) 
	const [accessToken, setAccessToken] = useState<any>();

	const initFacebookLogin = async () => {
		// Attempt login with permissions
		btnFacebook.current?.handleLoading(true)
		try {
			const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
			
			if (result.isCancelled) {
				btnFacebook.current?.handleLoading(false)
				return false
			}
		} catch (error) {
			console.log('error', error)
			return false
		}
		// Once signed in, get the users AccesToken
		const data = await AccessToken.getCurrentAccessToken();
		if (!data) {
			btnFacebook.current?.handleLoading(false)
			Alert.alert("Ocurrio un problema al obtener tus datos")
			return
		}
		setAccessToken(data)
		if (data) {
			const facebookCredential = facebookAuthProvider.credential(data.accessToken);
			let sign = await signWithCredentials(facebookCredential);
				if (!sign) {
					Alert.alert("Ocurrio un problema al registraro",sign)
					btnFacebook.current?.handleLoading(false)
					return
				}
				if (sign === "secondChance") {
					Alert.alert(
						"Cuenta ya registrada",
						"Parece que ya inicio sesion con el correo asociado a su cuenta, le gustaria asociar la cuenta?"
						,
						[
							{text:"No",
							onPress:()=>null
							},
							{text:"Si",
							onPress:()=>connectFacebook(data.accessToken,facebookCredential)
							}
						]
					)
				}
			
			
		}
		return false;
	}

	const connectFacebook = async(accessToken:string,credential:any) => { 
		//@ts-ignore
		const infoRequest = new GraphRequest('/me?fields=name,email', null, (error, result) => {
			console.log('result',result)
      if (error) {
        console.log(error.message);
      } else {
				//let methods = await fetchEmailMethods(email);
        //return LoginFunctions.signInOrLink(auth.FacebookAuthProvider.PROVIDER_ID, credential, result.email);
      }
    });
    new GraphRequestManager().addRequest(infoRequest).start();
	}
 
	return (
		<Button
			ref={btnFacebook}
			title='Facebook'
			onPress={initFacebookLogin}
			btnStyle={{ backgroundColor: "#1a74e4" }}
			txtStyle={{ fontSize: 18, fontWeight: "bold" }}
			icon="facebook"
			iconRigth
		/>
	);
};
 
export default ButtonFacebook;
