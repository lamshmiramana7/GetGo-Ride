# 🚕 GetGo Ride — Rapido & Uber Rival Transport Network Platform

A feature-complete, modern React ride-hailing & logistics web application designed for mobile devices, PWAs, and native Android APK conversion.

---

## 📱 Features

- **🚕 Multi-Vehicle Ride Booking**: Bike Taxi, Auto Rickshaw, AC Sedan, XL Van.
- **📦 Parcel Express Delivery**: Real-time rider allocation, OTP verification, photo proof.
- **🚌 Travel & Partner Booking**: Native Bus Ticket search + Direct Partner Redirects for **ConfirmTkt (Trains)** & **IndiGo Airlines (Flights)**.
- **🌐 6-Language Multilingual Support**: English, Tamil (தமிழ்), Hindi (हिन्दी), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Malayalam.
- **💳 Complete Payment Gateway**: Cash on Delivery (COD), Google Pay, HDFC Card, GetGo Wallet, SBI Net Banking.
- **📍 Interactive Saved Address Management**: Add, Edit, Delete saved home/work/gym addresses.
- **🌙 Light & Dark Mode**: Seamless persistent theme toggling.
- **🧾 Trip E-Receipt & Invoice Generator**: Printable/downloadable PDF tax invoices for completed trips.

---

## 🚀 1. Push to GitHub

To push this codebase to your own GitHub repository, run the following commands in your terminal:

```bash
# 1. Create a new repository on https://github.com/new (Name it: GetGo-Ride)

# 2. Add your repository as origin:
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/GetGo-Ride.git

# 3. Rename branch to main and push:
git branch -M main
git push -u origin main
```

---

## 🌐 2. Get Live Production URL (1-Click Hosting)

### Option A: Vercel (Recommended)
Run the following in your terminal:
```bash
npx vercel
```
*Vercel will build and give you an instant live https://getgo-ride.vercel.app URL!*

### Option B: Netlify
```bash
npm run build
npx netlify deploy --prod --dir=dist
```

---

## 📲 3. Convert Web App to Native Android APK

This repository is pre-configured with **Ionic Capacitor** and **Web App Manifest** for instant APK building.

```bash
# Step 1: Build production dist folder
npm run build

# Step 2: Add Android platform dependencies
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android
npx cap copy android

# Step 3: Open in Android Studio to build APK
npx cap open android
```

In Android Studio:
1. Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. Your `.apk` file will be generated in `android/app/build/outputs/apk/debug/app-debug.apk`!

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start Vite Dev Server
npm run dev
```

App runs locally at `http://localhost:5174/`
