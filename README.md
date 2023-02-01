# Passordless login

Repo de ejemplo para loguearse por diferentes medios sin usar contraseña y correo con react native y con swift - swiftui usando como base firebase

No olvidar para android generar el keystore para hacer pruebas en mode release.

Aqui la guia que tiene [reactnative](https://reactnative.dev/docs/signed-apk-android#windows)

`keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000`


`./gradlew signinReport`



