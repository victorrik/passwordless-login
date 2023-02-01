import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { PatitosError, UserType } from '@PasswordLessTypes'; 

/**
 * Funcion para ver si ya ha inciado sesion antes, y verificar que existe en el auth del servidor
 * En caso de no iniciar sesion o haber sido eliminado regresa un false
 * En caso de existir, se regresa info del usuario del auth de firebase
 * En caso de error se cierra la sesion y retorna false
 * @returns 
 */
export const checkExistence = async ():Promise<false | UserType> => {
	// Verificamos si ya ha iniciado sesioon
	const currentUser = auth().currentUser
	if (!currentUser) { return false;} 
	// Verificamos si existe la cuenta en el auth
	try {
		await currentUser.reload();
		console.log('currentUser',currentUser)
	} catch (e) {
		// En caso de estos errores que suelen ser por el emulador, se cierra la sesion
		//@ts-ignore
		if (e.code === "auth/internal-error" || e.code === "auth/invalid-user-token") {
			logout()
		}
		return false 
	} 
	return {
		email:currentUser.email ?? "Correo no registrado",
		displayName: currentUser.displayName ?? "Usuario",
		emailVerified: currentUser.emailVerified,
		isAnonymous: currentUser.isAnonymous,
		creationTime:currentUser.metadata.creationTime?Number(currentUser.metadata.creationTime):0,
		lastSignInTime:currentUser.metadata.lastSignInTime?Number(currentUser.metadata.lastSignInTime):0,
		phoneNumber:currentUser.phoneNumber ?? "",
		photoURL:currentUser.photoURL
	}
}
/**
 * Funcion para cerrar sesion
 * @returns 
 */
export const logout = () => auth().signOut()

/**
 * Funcion para iniciar sesion con correo y contraseña
 * Esta se usa despues de verificar el usuario en el serviridor y asi guardar su sesion de amnera local
 * @param email
 * @param password 
 * @returns 
 */
export const signIn = async(email:string,password:string):Promise<{uid:string,emailVerified:boolean}|PatitosError> => { 
	try {
		let userInfo = await auth().signInWithEmailAndPassword(email,password)
		return {uid:userInfo.user.uid,emailVerified:userInfo.user.emailVerified} 
		
	} catch (error:any) {
		let handleError:PatitosError = {error:"Error inesperado",description:error+'',location:"firebase/auth/signIn",code:error.code} 
		if (error.code === 'auth/wrong-password') {
			handleError.error = "Contraseña incorrecta"
		}
		return handleError
	}
	
}

/**
 * Funcion para verificar el correo
 * Esta se llama cuando se abre la app desde el link enviado al correo con un codio especial uwu
 * @param actionCode 
 * @returns 
 */
export const verifyEmail = async(actionCode:string):Promise<true | PatitosError> => {
	try {
		await auth().applyActionCode(actionCode)
		return true
	} catch (error) {
		//@ts-ignore
		let handleError:PatitosError = {error:error.message,description:error.code,location:"firebase/auth/verifyEmail"} 
		//let handleError:PatitosError = {error:"Error inesperado",description:error,location:"firebase/auth/verifyEmail",code:error.code} 
		// if (error.code === 'auth/invalid-action-code') {
		// 	handleError.error = 'Ocurrio un problema con el link, intente reenviando su correo'
		// }
		
		return handleError
	}
}

export const checkCodePasswordRestored = async(actionCode:string):Promise<string | PatitosError> => { 
	
	try {
		const verifyCode = await auth().verifyPasswordResetCode(actionCode); 

		return verifyCode;

	} catch (error:any) {
		let handleError:PatitosError = {error:error.message,description:error+"",location:"firebase/auth/verifyEmail",code:error.code} 
		// if (error.code === 'auth/invalid-action-code') {
		// 	handleError.description = 'Ocurrio un problema con el restablecimiento de contraseña, intente reenviando su correo';
		// }
		return handleError
	}
}

/**
 * Funcion para actualizar la contraseña desde link
 * @param actionCode 
 * @param newPassword 
 * @returns 
 */
export const restorePassword = async(actionCode:string,newPassword:string) => {
	try {
		const resetConfirmation = await auth().confirmPasswordReset(actionCode, newPassword);
		console.log("resetConfirmation",resetConfirmation)
		return true
	} catch (error:any) {
		let handleError:PatitosError = {error:error.message,description:error+"",location:"firebase/auth/verifyEmail",code:error.code} 
		// if (error.code === 'auth/invalid-action-code') {
		// 	handleError.description = 'Ocurrio un problema con el restablecimiento de contraseña, intente reenviando su correo';
		// }
		return handleError
	} 
}

export const loginWithFacebook = async (token:string) => { 

}

	
	// cambioMiContra=async(oldPass,newPass)=>{
	// 	const credential = auth.EmailAuthProvider.credential(auth().currentUser.email,oldPass);
	// 	const result = await auth().currentUser.reauthenticateWithCredential(credential)
	// 		.then((obj)=>obj)
	// 		.catch((e)=>{
	// 			let mensaje = 'Error inesperado intente más tarde';
	// 			switch (e.code) {
	// 				case 'auth/wrong-password':
	// 					mensaje = 'Contraseña actual incorrecta'
	// 					break;
	// 				default:
	// 					mensaje = 'Error inesperado intente más tarde';
	// 					break;
	// 			}
	// 			return {error:true,mensaje}
	// 		})
	// 	if (result.error) {
	// 		return result;
	// 	}
	// 	return await auth().currentUser.updatePassword(newPass)
	// 	.then(()=>true)
	// 	.catch((e)=>{
	// 		let mensaje = 'Error inesperado intente más tarde';
	// 		if (e) {
	// 			mensaje = e.code;
	// 		}
	// 		return {error:true,mensaje}
	// 	}) 
	// }
