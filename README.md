# Weather App (Expo SDK 54)

A modern, high-performance Weather Application built with React Native and Expo. This app provides real-time weather data based on your location and allows you to search for any city worldwide to view an 8-day forecast.

## 🚀 Features

-   **Location-Aware:** Automatically detects your current city and displays live weather conditions.
-   **Global Search:** Find weather details for any city globally using the Open-Meteo geocoding API.
-   **8-Day Forecast:** Detailed daily breakdown including temperature ranges and condition icons.
-   **Dark Theme:** A clean, high-contrast dark UI inspired by modern mobile design standards.
-   **High Performance:** Optimized using `pnpm` for package management and `oxlint` for lightning-fast linting.
-   **Automated Testing:** Core utilities and weather logic are verified with `vitest`.

## 🛠️ Tech Stack

-   **Framework:** [Expo SDK 54](https://expo.dev/) (Compatible with Expo Go)
-   **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
-   **Package Manager:** [pnpm](https://pnpm.io/)
-   **API:** [Open-Meteo](https://open-meteo.com/) (No API key required)
-   **Styling:** Standard React Native `StyleSheet` (Dark Mode optimized)
-   **Linting:** [Oxlint](https://github.com/oxc-project/oxc)
-   **Testing:** [Vitest](https://vitest.dev/)

## 📦 Getting Started

### Prerequisites

-   Node.js (v18 or newer)
-   pnpm (`npm install -g pnpm`)
-   [Expo Go](https://expo.dev/client) app installed on your mobile device (for testing)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd weather-app-expo
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

### Running the App

1.  Start the Expo development server:
    ```bash
    pnpm start
    ```
2.  Open the **Expo Go** app on your phone and scan the QR code displayed in your terminal.

## 🧪 Development Commands

-   **Start Project:** `pnpm start`
-   **Run Tests:** `pnpm test`
-   **Lint Code:** `pnpm lint`
-   **Fix Dependencies:** `npx expo install --check`

## 📁 Project Structure

```text
├── app/               # Expo Router screens and layouts
│   ├── (tabs)/        # Main tab navigation (Home, Search)
│   ├── details.tsx    # Weather details & 8-day forecast
│   └── _layout.tsx    # Root navigation configuration
├── components/        # Shared UI components
├── services/          # API and hardware logic (Weather, Location)
├── constants/         # Theme and color definitions
├── babel.config.js    # Babel configuration for Reanimated & Router
└── vitest.config.ts   # Vitest testing configuration
```

## ⚖️ License

This project is licensed under the MIT License.
