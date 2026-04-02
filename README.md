# 📱 Capital Manager - Frontend Dashboard

A cross-platform wealth management and financial aggregator interface. Built with React Native and Expo, this application delivers a seamless, responsive experience across both web browsers and mobile devices.

This repository serves as the frontend client for the Capital Manager ecosystem, designed to eventually allow users to aggregate portfolios from various brokers (like Balanz, Bull Market, etc.) into a single, unified command center.

## ✨ Core Features

* **Cross-Platform Architecture:** Built mobile-first using Expo, but fully optimized to compile and render as a high-performance web application.
* **Advanced Financial Visualization:** Implements complex, multi-layered technical indicators (like MACD, Signal Lines, and Histograms) using responsive SVG charting.
* **Intelligent Data Scaling:** Custom mathematical boundary algorithms automatically frame extreme market volatility (deep negative/positive swings) perfectly within the viewport.
* **Responsive Layout:** Dynamically calculates screen dimensions to provide a constrained, professional terminal view on desktop monitors, while enabling native horizontal scrolling and touch interactions on mobile screens.
* **Dark Mode UI:** A sleek, professional dark theme designed to reduce eye strain during prolonged financial analysis.

## 🚀 Tech Stack

* **Framework:** React Native / Expo
* **Language:** TypeScript
* **Charting:** `react-native-gifted-charts` & `react-native-svg`
* **Routing:** Expo Router (File-based routing)

## 🛠️ Local Development & Setup

### Prerequisites
* Node.js (v20+)
* The Capital Manager NestJS backend must be running (either locally or on your cloud server) with CORS enabled.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/exequiel1984/capital-manager-app.git](https://github.com/exequiel1984/capital-manager-app.git)
   cd capital-manager-app
   ```

2. **Install core dependencies:**
   ```bash
   npm install
   ```

3. **Install Expo-specific modules:**
   ```bash
   npx expo install react-native-web react-dom @expo/metro-runtime react-native-svg expo-linear-gradient
   ```

4. **Start the development server (Web Mode):**
   ```bash
   npm run web
   ```
This will launch the Metro bundler and automatically open the application in your default web browser at http://localhost:8081.

## 🔗 Architecture Note
This frontend application is completely decoupled from the database layer. It relies entirely on the capital-manager NestJS API to fetch real-time market data, process technical analysis algorithms, and manage user portfolios.