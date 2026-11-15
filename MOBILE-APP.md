# EnglishGo mobile app

This repository keeps the existing GitHub Pages website as the source of truth and prepares a local web bundle for Capacitor.

## Current architecture

- Existing website: `index.html` at the repository root (GitHub Pages remains unchanged).
- Mobile bundle: generated into `www/` by `npm run prepare:mobile`.
- Native runtime: Capacitor 8.
- App ID: `com.englishgo.app`.
- App name: `EnglishGo`.

The preparation script copies the website and its local image/Firebase files into `www/`. Edit the root website, then run the preparation script again before syncing native projects.

## Windows setup: Android first

1. Install Node.js 22 or later and Git.
2. Install Android Studio and its Android SDK.
3. Open PowerShell in the repository folder.
4. Run:

```powershell
npm install
npm install @capacitor/android
npm run prepare:mobile
npx cap add android
npx cap sync android
npx cap open android
```

In Android Studio, wait for Gradle sync, choose an emulator or connected Android phone, then press Run.

After website changes:

```powershell
npm run cap:sync
```

## iPhone / App Store later

Capacitor's iOS project must be generated and built on macOS with Xcode. Windows alone cannot run Xcode or produce the signed iOS archive needed for App Store submission. When ready, use a Mac (your own, borrowed, or a Mac build service):

```bash
npm install
npm install @capacitor/ios
npm run prepare:mobile
npx cap add ios
npx cap sync ios
npx cap open ios
```

Then configure signing, test on real iPhones, archive in Xcode, and upload through App Store Connect.

## Before public release

- Replace/confirm the final app icon and splash screen.
- Add native microphone permission explanations and verify recording in the iOS and Android WebViews.
- Test every recording, speech, audio playback, login, Firebase sync, and external-link flow on real devices.
- Add a privacy policy and explain whether recordings stay on-device or are uploaded.
- Add App Store screenshots, description, support URL, age rating, and privacy disclosures.
- Review Apple's minimum-functionality and app-review requirements; a thin website wrapper may be rejected. Add app-specific navigation and native-quality behaviour before submission.

## Important

Do not commit `node_modules`, generated `www/`, or native platform folders. They are generated locally from the root website and Capacitor dependencies.
