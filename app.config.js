const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';
const IS_PRODUCTION = process.env.APP_VARIANT === 'production';

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.peterto.LinkBuddy.dev";
  }

  if (IS_PREVIEW) {
    return "com.peterto.LinkBuddy.preview";
  }

  return "com.peterto.LinkBuddy";
};

const getAppName = () => {
  if (IS_DEV) {
    return "LinkBuddy (Dev)";
  }

  if (IS_PREVIEW) {
    return "LinkBuddy (Preview)";
  }

  return "LinkBuddy: For Linkding";
};

const getSchemeName = () => {
  if (IS_DEV) {
    return "linkbuddydev";
  }

  if (IS_PREVIEW) {
    return "linkbuddypreview"
  }

  return "linkbuddy"
}

export default {
    // "name": IS_DEV ? "LinkBuddy (Dev)" : "LinkBuddy",
    "name": getAppName(),
    "scheme": getSchemeName(),
    "slug": "LinkBuddy",
    // "name": "linkbuddydev",
    // "scheme": "linkbuddydev",
    // "slug": "LinkBuddydev",
    "version": "1.3.3",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "ios": {
      "supportsTablet": true,
      // "bundleIdentifier": IS_DEV ? "com.peterto.LinkBuddy.dev" : "com.peterto.LinkBuddy",
      "bundleIdentifier": getUniqueIdentifier(),
      "config": {
          "usesNonExemptEncryption": false
        },
        "infoPlist": {
          "NSAppTransportSecurity": {
            "NSAllowsArbitraryLoads": true,
            "NSAllowsLocalNetworking": true
          }
      },
      "entitlements": {
        "aps-environment": "development",
      },
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#010104"
      },
      // "package": IS_DEV ? "com.peterto.LinkBuddy.dev" : "com.peterto.LinkBuddy",
      "package": getUniqueIdentifier(),
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-secure-store",
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#2f27ce",
          "image": "./assets/splash-bookmark.png",
          "dark": {
            "image": "./assets/splash-bookmark.png",
            "backgroundColor": "#2f27ce"
          },
          "imageWidth": 200
        }
      ],
      [
        "expo-share-intent",
        {
          "iosActivationRules": {
            "NSExtensionActivationSupportsWebURLWithMaxCount": 1,
            "NSExtensionActivationSupportsText": true
          },
          "androidIntentFilters": ["text/*"]
        }
      ],
      [
        "expo-sqlite"
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "abf48038-bdde-4168-a261-cce3dfd1c9dc"
      }
    },
    "owner": "peterto"
  };
