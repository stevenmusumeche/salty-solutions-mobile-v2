# Salty Solutions Mobile

This project was bootstrapped with `create-expo-app`

## Local dev

### Run in iOS Simulator

`npm run ios`

### Use Expo Go

`npm run dev`

## GraphQL Codegen

Queries/mutations are stored in `graphql/documents`.  The generated types/hooks are in `graphql/generated.tsx`.

`npm run codegen`

## Builds

To build remotely with Expo's EAS:

### Standalone development builds

After these are done, you can install them on your phone by using the QR code.  The device that you are installing it on has to have been added to your Apple provisioning profile via Expo with `eas device:create`.

```sh
EXPO_NO_CAPABILITY_SYNC=1 eas build --platform ios --profile development-standalone
EXPO_NO_CAPABILITY_SYNC=1 eas build --platform android --profile development-standalone
```

### Standalone production builds

```sh
EXPO_NO_CAPABILITY_SYNC=1 eas build --platform ios --profile production
EXPO_NO_CAPABILITY_SYNC=1 eas build --platform android --profile production
```

## Expo info

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

### Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
