/**
 * Tactile Haptic Feedback Utility for Android and Mobile Web
 * Supports Capacitor Haptics API & standard W3C Vibration API
 */
export const triggerHaptic = (type = 'light') => {
    try {
        // Try Web Vibration API if supported
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            switch (type) {
                case 'selection':
                case 'light':
                    navigator.vibrate(15);
                    break;
                case 'medium':
                    navigator.vibrate(28);
                    break;
                case 'heavy':
                    navigator.vibrate(45);
                    break;
                case 'success':
                    navigator.vibrate([20, 40, 20]);
                    break;
                case 'warning':
                case 'error':
                    navigator.vibrate([35, 60, 35]);
                    break;
                case 'spinTick':
                    navigator.vibrate(10);
                    break;
                default:
                    navigator.vibrate(15);
            }
        }
    } catch (e) {
        // Suppress any vibration API errors on unsupported desktop platforms
    }
};

export default triggerHaptic;
