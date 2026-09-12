/**
 * Android Hardware Back Button & Modal Back Stack Handler
 */

const modalStack = [];

export const registerModal = (id, closeFn) => {
    // Remove if already in stack to prevent duplicates
    const index = modalStack.findIndex(m => m.id === id);
    if (index !== -1) {
        modalStack.splice(index, 1);
    }
    modalStack.push({ id, closeFn });
};

export const unregisterModal = (id) => {
    const index = modalStack.findIndex(m => m.id === id);
    if (index !== -1) {
        modalStack.splice(index, 1);
    }
};

export const handleAndroidBack = () => {
    if (modalStack.length > 0) {
        const topModal = modalStack.pop();
        if (topModal && typeof topModal.closeFn === 'function') {
            topModal.closeFn();
            return true; // Handled modal dismissal
        }
    }
    return false; // Let router or system handle back
};

// Initialize listeners for Capacitor App plugin & browser popstate
if (typeof window !== 'undefined') {
    // Check if Capacitor App plugin is available
    import('@capacitor/app').then(({ App }) => {
        App.addListener('backButton', ({ canGoBack }) => {
            const handled = handleAndroidBack();
            if (!handled) {
                if (canGoBack) {
                    window.history.back();
                } else {
                    App.exitApp();
                }
            }
        });
    }).catch(() => {
        // Not running in Capacitor native shell, fallback to window popstate
        window.addEventListener('popstate', (e) => {
            if (modalStack.length > 0) {
                const handled = handleAndroidBack();
                if (handled) {
                    e.preventDefault();
                }
            }
        });
    });
}
