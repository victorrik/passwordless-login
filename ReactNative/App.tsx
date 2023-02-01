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
	ScrollView,
	StyleSheet,
	Text,
	View
} from 'react-native';
import auth from '@react-native-firebase/auth'
import { LoginManager, Settings, ShareDialog, AccessToken } from 'react-native-fbsdk-next';
import { Button, Icons } from '@components';
import { checkExistence } from '@firebase/auth';
import { UserType } from '@PasswordLessTypes';
import { Value } from 'react-native-reanimated';
import { ButtonRef } from '@PasswordLess/components/Button';

Settings.initializeSDK();

const SCREEN_HEIGHT= Math.round(Dimensions.get('window').height)
const SCREEN_WIDTH = Math.round(Dimensions.get('window').width)
const App = () => {
	const btnFacebook = useRef<ButtonRef>(null)
	const btnGoogle = useRef<ButtonRef>(null)
	const btnEmail = useRef<ButtonRef>(null)
	const btnPhone = useRef<ButtonRef>(null)
	const [userData, setUserData] = useState<UserType>();

	useEffect(() => {
		checoSiYaInicieSesion()
	}, [])

	const checoSiYaInicieSesion = async() => {
		let userExistence = await checkExistence()
		if (userExistence) {
			setUserData(userExistence)
		}
	}
	
	const initFacebookLogin = async () => { 
		// Attempt login with permissions
		const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
		if (result.isCancelled) {
			
			return
		}
		// Once signed in, get the users AccesToken
		const data = await AccessToken.getCurrentAccessToken();
		
		if (!data) {
			Alert.alert("Ocurrio un problema al obtener tus datos")
			return
		}

		if (data) {
			try {
				// Se crea las credenciales de firebase para facebook
				const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
				// Se inicia sesion con las credenciales
				let authAnswer = await auth().signInWithCredential(facebookCredential);
				console.log('authAnswer->',authAnswer)
				return true
			} catch (error) {
				Alert.alert("Ocurrio un problema registrar tus datos")
				return false
			}
			
		}
		return false;

	}
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				contentContainerStyle={styles.scrollContainer}
			>
				{userData && 
					<View style={styles.userContainer} >
						{userData.photoURL && userData.photoURL.length ? 
							<Image style={styles.photo}  source={{uri:userData.photoURL}} />:
							<View style={{width:"50%",height:"auto",backgroundColor:'gold'}} >
								<Icons name="personbadge" />
							</View>
						}
						<Text style={styles.waving} >Hola <Text style={styles.displayName} >{userData.displayName}</Text></Text>
					</View>
				}
				<Text style={{fontSize:20,textAlign:'center',marginBottom:16}} >
					¿Como te gustaria <Text style={{fontWeight:"bold"}} >iniciar sesión</Text>?
				</Text>
				<Button 
					title='Facebook' 
					onPress={initFacebookLogin} 
					btnStyle={{backgroundColor:"#1a74e4"}}
					txtStyle={{fontSize:18,fontWeight:"bold"}}
					icon="facebook"
					iconRigth
				/>

			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContainer: {
		padding: 24
	},
	userContainer:{
		justifyContent:'center',
		alignItems:'center',
		marginBottom: 16
	},
	photo:{
		width: SCREEN_WIDTH * 0.35,
		height: SCREEN_WIDTH * 0.35,
		borderRadius: 100,
		marginBottom: 16
	},
	waving:{
		fontSize:18,
		textAlign:"center"
	},
	displayName:{
		fontWeight:"bold"
	}
});

export default App;
