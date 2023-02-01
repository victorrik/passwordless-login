import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { create } from 'zustand'



interface CredentialsStore {
  credentials:{[key: string]:FirebaseAuthTypes.AuthCredential},
	providers:Array<any>,
	saveProviders:(providers:[any])=>void,
	add:(credential:FirebaseAuthTypes.AuthCredential)=>void;
	get:(provider:string)=>FirebaseAuthTypes.AuthCredential | false;
	clean:()=>void
}

const useCredentialsStore = create<CredentialsStore>((set,get) => ({
	credentials:{}, 
	providers:[],
	saveProviders:(providers)=>{
		set({providers:providers})
	},
	add: (credential) => {
		set({credentials:{...get().credentials,[credential.providerId]:credential}})
	},
	get: (provider) => {
		return get().credentials[provider];
	},
	clean: () => {
		set({credentials:{}})
	},
}));

export default useCredentialsStore;