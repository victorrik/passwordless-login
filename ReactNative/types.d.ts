export type Meow = "meow"
export type PatitosError = {
	error:string;
	description:string;
	location:string;
	code?:any;
	OS?: Platform.OS; 
}

export type UserType = {
		displayName: string
		email: string
		emailVerified: boolean
		isAnonymous: boolean
		creationTime: number
		lastSignInTime: number
		providerData:any,
		// multiFactor: {
		// 	enrolledFactors: Array
		// }, 
		phoneNumber: any,
		photoURL: string | null
		
}