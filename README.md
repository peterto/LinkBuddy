# ![](/assets/favicon.png) 
# LinkBuddy: For Linkding

Unofficial iOS client for [linkding](https://linkding.link), [github for linkding](https://github.com/sissbruecker/linkding), selfhosted bookmarking service. 

<!-- ![](/assets/screenshots/2025-01-16%2018-09-38%20High%20Res%20Screenshot.png) -->

 <img height="500px" src="./assets/screenshots/2025-01-16 19-39-37 High Res Screenshot.png" />
 <img height="500px" src="./assets/screenshots/2025-01-16 19-39-02 High Res Screenshot.png" />
 <img height="500px" src="./assets/screenshots/2025-01-16 19-42-08 High Res Screenshot.png" />
 <img height="500px" src="./assets/screenshots/2025-01-16 19-42-52 High Res Screenshot.png" />

<br />

This is my first end-to-end opensource project written in React Native using Expo. Please take some time to download and review it! I decided to open source it for transparency, as well as, for users to be able to track the development process.

If you find a bug or have improvement feel free to [submit issues](https://github.com/peterto/LinkBuddy/issues), pull-requests or use the [support email](mailto:linkbuddyapp@gmail.com) in the app to send me an email.

#### App features:
- Codebase for iOS written in React Native using expo.
- Add, edit, archive and delete bookmarks
- View and search your bookmarks
- View and search your archived bookmarks
- Supports share sheet extension to share URLs from other apps into LinkBuddy
- Open and view links in in-app web browser- Supports Safari Reader View via in-app web browser- Supports dark mode and light mode themes
- iPad compatible (just a blown up iPhone UI for now)
- This app doesn't store or track any personal user information. Please feel free to read the [Privacy Policy](https://github.com/peterto/LinkBuddy/wiki/Privacy-Policy)

#### Folders structure:
- src
    - assets - static files
    - components - common React Native components
    - contexts - zustand context store
    - screens - navigation screens
    - styles - color styling for dark/light mode
    - services - API services for linkding

#### Used components:
- [Expo](https://expo.dev)
- [Expo eas-cli](https://docs.expo.dev/eas/) for building and submission
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [React Native Elements](https://reactnativeelements.com/) for styling
- [React Navigation](https://reactnavigation.org/)
- [React Native Gesture Handler](https://www.npmjs.com/package/react-native-gesture-handler) for handling touch input


### Known issues

- [ ] Doesn't show bookmarks or an error message when the user is offline.
- [ ] Doesn't work with tailscale ip or tailscale long dns, however, tailscale short dns works fine.
- [ ] This app only works with the available endpoints from linkding.