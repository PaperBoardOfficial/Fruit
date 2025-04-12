# Fruit

A productivity application built with Expo and React Native that combines pomodoro timer, habit tracking, and spaced repetition learning tools.

## Features

- ⏱️ **Pomodoro Timer**: Focus with customizable work and break sessions
- ✅ **Habit Tracker**: Build consistency with daily habit tracking
- 🔄 **Spaced Repetition**: Optimize learning with scheduled review reminders
- 📊 **Statistics**: Visualize your productivity with detailed charts and graphs

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the development server

   ```bash
   npx expo start
   ```

   This will present options to run the app on:
   - 📱 Android emulator
   - 📱 iOS simulator
   - 🌐 Web browser
   - 📲 Physical device via Expo Go

## Building for Production

To build an Android APK:

```bash
./build-android.sh
```

The APK will be available at `./fruit.apk` after the build completes.

## Technology Stack

- [Expo](https://expo.dev): React Native framework
- [NativeWind](https://nativewind.dev): Tailwind CSS for React Native
- [Zustand](https://github.com/pmndrs/zustand): State management
- [Notifee](https://notifee.app): Advanced notifications

## Project Structure

- `/src/app`: Application screens and navigation (uses file-based routing)
- `/src/components`: Reusable UI components
- `/src/store`: State management with Zustand
- `/src/services`: Core functionality services
- `/src/types`: TypeScript type definitions
- `/src/utils`: Helper functions and utilities

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [NativeWind Documentation](https://nativewind.dev/docs/getting-started)

## License

This project is proprietary software.
