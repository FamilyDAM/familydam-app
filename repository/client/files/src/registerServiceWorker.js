

export default function register() {
    const swUrl = `/files/service-worker-files.js`;
    navigator.serviceWorker.register(swUrl).then(registration => {
        console.debug("[app] sw registered" +registration);
    }).catch(error => {
        console.error('[app] Error during service worker registration:', error);
    });
}


export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.unregister();
        });
    }
}
