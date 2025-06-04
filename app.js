{
  "expo": {
    "name": "تطبيق حلاقة منزلية مخصص",
    "slug": "tatbiq-halaqa-manzilia-mokhtas",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "app.rork.tatbiq-halaqa-manzilia-mokhtas"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "app.rork.tatbiq-halaqa-manzilia-mokhtas"
    },
    "web": {
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      [
        "expo-router",
        {
          "origin": "https://rork.com/"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
