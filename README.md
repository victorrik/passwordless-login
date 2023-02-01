# Passordless login

Repo de ejemplo para loguearse por diferentes medios sin usar contraseña y correo con react native y con swift - swiftui usando como base firebase

No olvidar para android generar el keystore para hacer pruebas en mode release.

Aqui la guia que tiene [reactnative](https://reactnative.dev/docs/signed-apk-android#windows)

`keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000`


`./gradlew signinReport`


## Registrar facebook para android
siguiendo la instrucciones de la [libreria](https://github.com/thebergamo/react-native-fbsdk-next) y como recordatorio interno uwu

### Actualiza tu manifiesto
Los strings deberian verse asi
```xml
<resources>
    <string name="app_name">PasswordLess</string>
		<string name="facebook_app_id">####</string>
		<string name="facebook_client_token">####</string>
</resources>

```

El android manifest deberia verse al final asi

```xml
...
		<intent-filter>
			<action android:name="android.intent.action.MAIN" />
			<category android:name="android.intent.category.LAUNCHER" />
		</intent-filter>
	</activity>
	<meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id"/>
	<meta-data android:name="com.facebook.sdk.ClientToken" android:value="@string/facebook_client_token"/>
</application>
...
```

Ejecutar apps de ejemplo

Ejecutamos el generador y para mayor comodidar ir directo a donde se encuentra el `debug.keystore` en `android/app` y en el `build.gradle` vas a encontrar la contraseña de debug, en caso de usar la de release, poner los datos de release

```
keytool -exportcert -alias androiddebugkey -keystore debug.keystore | openssl sha1 -binary | openssl base64
```

