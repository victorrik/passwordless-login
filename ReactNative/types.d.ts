export type Meow = "meow"
export type PatitosError = {
	error:string;
	description:string;
	location:string;
	code?:any;
	OS?: Platform.OS; 
}