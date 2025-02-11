# Frontend

This project is built using React Native and Expo. Follow the steps below to set up and run the project using Expo Go.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed [Node.js](https://nodejs.org/en/download/) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
- You have installed [Expo CLI](https://docs.expo.dev/get-started/installation/).

## Setup

1. **Clone the repository:**
    ```sh
    git clone https://github.com/hruif/TravelPartner
    cd frontend
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Start the Expo development server:**
    ```sh
    npm start
    ```

4. **Install Expo Go on your mobile device:**
    - For Android: [Expo Go on Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
    - For iOS: [Expo Go on the App Store](https://apps.apple.com/us/app/expo-go/id982107779)

5. **Open the project in Expo Go:**
    - Scan the QR code displayed in the terminal or the browser with the Expo Go app.

## Running on a Simulator

If you prefer to run the app on an iOS or Android simulator, follow these steps:

1. **For iOS:**
    - Ensure you have Xcode installed.
    - Start the Expo development server:
        ```sh
        npm start
        ```
    - Press `i` to open the app in the iOS simulator.

2. **For Android:**
    - Ensure you have Android Studio installed and an Android Virtual Device (AVD) configured.
    - Start the Expo development server:
        ```sh
        npm start
        ```
    - Press `a` to open the app in the Android emulator.

## Project Structure

- [App.tsx](http://_vscodecontentref_/0): The main entry point of the application.
- `assets/`: Contains images and other assets.
- [index.ts](http://_vscodecontentref_/1): Registers the root component.

## Google Map Integration (Temp notes)

When the basic layout has been implemented, ensure that the first thing the user sees is the map. The backend has been already designed for calls. I will help develop the startup page.

## Learn More

To learn more about Expo and React Native, check out the following resources:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
