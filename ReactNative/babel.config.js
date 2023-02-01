module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
	plugins: [[
		'react-native-reanimated/plugin',
		//{ globals: ['__scanCodes'], } 
	],
	[
		'module-resolver',
		{
			root: ['.'],
			alias: {
				"@PasswordLess": "./src",
				"@components": "./src/components",
				"@firebase": "./src/firebase",
				"@stores": "./src/stores",
				"@utils": "./src/utils",
				"@PasswordLessTypes": "./types"
			},
		},
	],
	[
		"module:react-native-dotenv",
		{
				//envName: 'APP_ENV',
				moduleName: "@env",
				path: ".env",
		},
	],
],
};

