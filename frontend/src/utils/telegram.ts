// Minimal type definition for the Telegram WebApp runtime.
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        showAlert: (message: string) => void;
        sendData: (data: string) => void;
      };
    };
  }
}

const getWebApp = () => window.Telegram?.WebApp;

// Prepare the Telegram container whenever the WebApp boots.
export const bootstrapTelegram = () => {
  const webApp = getWebApp();
  if (!webApp) return;
  webApp.ready();
  webApp.expand();
};

// Send an optional payload back to the bot and close the WebApp gracefully.
export const tgClose = (message?: string) => {
  const webApp = getWebApp();
  if (!webApp) return;
  if (message) {
    webApp.sendData(JSON.stringify({ status: 'paid', message }));
    webApp.showAlert(message);
  }
  webApp.close();
};

export {}; // Ensure this file is treated as a module.
