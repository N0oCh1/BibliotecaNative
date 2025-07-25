
import "dotenv/config";
export default {
  "expo": {
    "name": "BibliotecaNative",
    "slug": "BibliotecaNative",
    "scheme": "Biblioteca",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "useCleartextTraffic": true,
      "package": "com.N0oCh1.BibliotecaNative",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    extra: {
      API_KEY : process.env.API_KEY,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      PROJECT_ID: process.env.PROJECT_ID,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
      APP_ID: process.env.APP_ID,
      "eas": {
        "projectId": "3432fb41-944e-4e18-9958-4584885f2d92"
      }
    },
    "plugins": [
      "expo-router",
      "react-native-edge-to-edge",
        [
        "expo-notifications",
        {
          "icon": "./assets/icon.png",
          "color": "#ffffff",
          "defaultChannel": "default",
          "enableBackgroundRemoteNotifications": false
        }
      ]
    ]
  }
}
