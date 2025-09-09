# Salty Solutions Mobile

This project was bootstrapped with `create-expo-app`

## Local dev

### Run in iOS Simulator

`npm run ios`

You can also choose which device to run it on by passing the device flag:

```bash
# See devices available:
xcrun simctl list devices

# Run with a specific device
npm run ios -- --device "iPhone 16 Pro Max"
```

### Run in Android Emulator

`npm run android`

You can also choose which device to run it on by passing the device flag:

```bash
# See devices available:
emulator -list-avds

# Run with a specific device
npm run android -- --device "Pixel_9_Pro
```

### Continuous Native Generation

This app uses Expo's CNG, which is desribed here: <https://docs.expo.dev/workflow/continuous-native-generation/>

When certain changes are made to the project, you may get errors when running the app.  You can try removing the native projects (ios and android directories) and rebuilding them by using this command.

`npx expo prebuild --clean`

### Use Expo Go

`npm run start`

Then scan the QR code with your phone.

## GraphQL

GraphQL queries and fragments are in the graphql/documents directory.  To generate type-safe hooks, run `npm run codegen`.  The resulting generated code will be in graphql/generated.tsx.

## Builds

To build remotely with Expo's EAS:

### Development builds

After these are done, you can install them on your phone by using the QR code from Expo, but they require running the development server locally.  Then you can make code changes and see the results hot-reloaded on the device. The device that you are installing it on has to have been added to your Apple provisioning profile via Expo with `eas device:create`.

```sh
EXPO_NO_CAPABILITY_SYNC=1 eas build --platform ios --profile development
EXPO_NO_CAPABILITY_SYNC=1 eas build --platform android --profile development
```

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

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
