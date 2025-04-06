import { Alert, Platform, AlertButton } from 'react-native';

/**
 * Cross-platform alert that works on iOS, Android, and Web
 */
// reference: https://stackoverflow.com/questions/65481226/react-native-alert-alert-only-works-on-ios-and-android-not-web
const showAlert = (
    title: string,
    message?: string,
    buttons: AlertButton[] = [{ text: 'OK' }]
): void => {
    if (Platform.OS === 'web') {
        // Web implementation using browser's confirm/alert
        if (buttons.length <= 1) {
            // Simple alert with just an OK button
            window.alert(`${title}\n${message || ''}`);
            const okButton = buttons.find(button => button.style !== 'cancel');
            okButton?.onPress?.();
        } else {
            // Confirmation dialog with OK/Cancel
            const result = window.confirm(`${title}\n${message || ''}`);

            if (result) {
                // User clicked OK
                const confirmButton = buttons.find(button => button.style !== 'cancel');
                confirmButton?.onPress?.();
            } else {
                // User clicked Cancel
                const cancelButton = buttons.find(button => button.style === 'cancel');
                cancelButton?.onPress?.();
            }
        }
    } else {
        // Native implementation for iOS and Android
        Alert.alert(title, message, buttons);
    }
};

export default showAlert; 