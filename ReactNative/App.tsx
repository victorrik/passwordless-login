import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
	Dimensions,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View, 
	useColorScheme
} from 'react-native';
import { Button, Icons } from '@components';
import { checkExistence, logout } from '@firebase/auth';
import { UserType } from '@PasswordLessTypes';
import ButtonFacebook from '@PasswordLess/ButtonFacebook';
import ButtonGoogle from '@PasswordLess/ButtonGoogle';
import useCredentialsStore from '@PasswordLess/store/useCredentialStore';
import ButtonPhoneNumber from '@PasswordLess/ButtonPhoneNumber';



const SCREEN_HEIGHT = Math.round(Dimensions.get('window').height)
const SCREEN_WIDTH = Math.round(Dimensions.get('window').width)

const App = () => {
	const colors = useColorScheme()
	const [userData, setUserData] = useState<UserType>();
	const [dataToShow, setDataToShow] = useState({displayName: "",photoURL: "",uid: "",providerId: "",email: ""})

	const credentialStore = useCredentialsStore()

	useEffect(() => {
		checkCurrentUser()
	}, [])

	const checkCurrentUser = async () => {
		let userExistence = await checkExistence();
		if (userExistence) {
			setDataToShow(userExistence.providerData[0])
			setUserData(userExistence);
			credentialStore.saveProviders(userExistence.providerData)
		}
	}
	
	const colorText = colors === "dark" ? "white" : "black";
	
	return (
		<SafeAreaView style={styles.container}>
			<View
				style={styles.scrollContainer}
			>
				{userData &&
					<View style={styles.userContainer} >
						{dataToShow.photoURL && dataToShow.photoURL.length ?
							<Image style={styles.photo} source={{ uri: dataToShow.photoURL }} /> :
							<View style={styles.iconUser} >
								<Icons size={50} name="personbadge" />
							</View>
						}
						<Text style={[styles.waving, { color: colorText }]} >Hola <Text style={styles.displayName} >{dataToShow.displayName}</Text></Text>
						<Text style={{marginBottom:16}} >Has iniciado sesión con:</Text>
						<View style={{flexDirection:'row'}} >
							{userData.providerData.map((obj: any, index: number) =>
								<Fragment key={index + ""}>
								{index? <View  style={{width:20}} /> : null}
								<TouchableOpacity  
									disabled={dataToShow.providerId === obj.providerId} 
									style={[styles.btnDataProvider,{backgroundColor:dataToShow.providerId === obj.providerId? "gray":"white"}]}	  
									onPress={()=>setDataToShow(obj)}
									>
									<Icons size={25} color='black' name={obj.providerId.replace(".com","")} />
								</TouchableOpacity	>
								</Fragment>
								
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
					<ButtonPhoneNumber checkCurrentUser={checkCurrentUser} />
					<View style={{ height: 20 }} />
					<Button
						title='Cerrar sesión'
						onPress={()=>{
							logout()
							checkCurrentUser()
						}}
						icon="boxarrowright"
						iconRigth
						btnStyle={{ backgroundColor:"red" }}
						txtStyle={{ color: "white", fontSize: 18, fontWeight: "bold" }}
						highlight="white"
					/>
				</View>
			</View>
		</SafeAreaView>
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
	btnDataProvider:{
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		padding: 16,
		borderRadius: 4,
		position: 'relative',
		backgroundColor: "white",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	} 
});

export default App;
