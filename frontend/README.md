# Frontend (Developer Guide)
Frontend for the Globe Gram app built with React Native and Expo. 

## Table of Contents
- [Dependencies](#dependencies)
- [Quick Start](#quick-start)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Resources](#resources)


## Dependencies
Before you begin, install the following dependencies:
- [node.js](https://nodejs.org/en/download/)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Expo CLI](https://docs.expo.dev/more/expo-cli/)


## Quick Start

1. Clone the repository
    ```sh
    git clone https://github.com/hruif/TravelPartner
    cd frontend
    ```

2. Install dependencies
    ```sh
    npm install
    ```

3. Start the Expo development server
    ```sh
    npm start
    ```

4. You can now connect via phone or emulator
    - Phone (Expo Go)
      - **Android** - [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
      - **iOS** - [App Store](https://apps.apple.com/us/app/expo-go/id982107779)
    - Emulator
      - **Windows/Linux** - [Android Studio](https://developer.android.com/studio)
      - **MacOS** - [Xcode](https://developer.apple.com/xcode/)

## Testing
```sh
npm test
```


## Project Structure
The project structure is as follows:
```
frontend/
│── 📂 assets/                 # Static assets like images, fonts, icons
│── 📂 src/                    # Main source code directory
│   │── 📂 services/           # API calls and network requests
│   │── 📂 components/         # Reusable UI components
│   │── 📂 hooks/              # Custom hooks
│   │── 📂 screens/            # App screens/pages
│   │── 📂 styles/             # Global styles, themes
│   │── 📂 utils/              # Helper functions and utilities
│   ├── App.tsx                # Entry point for the app
│── 📂 tests/                  # Jest, React Native Testing Library tests
│── 📜 package.json            # Dependencies and scripts
│── 📜 README.md               # Project documentation
```

## Resources
To learn more about Expo and React Native, check out the following resources:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
