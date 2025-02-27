<div align="center">

# Globe Gram

![GlobeGram](https://github.com/hruif/TravelPartner/blob/398a16233d6fc3454b18d2fadbf12701d93e520e/assets/logo_128_rounded.png)

**Social Travel Planning Made Easy**

[![GitHub release](https://img.shields.io/github/v/tag/hruif/TravelPartner)]()
[![GitHub license](https://img.shields.io/github/license/hruif/TravelPartner?color=green)]()
[![GitHub issues](https://img.shields.io/github/issues/hruif/TravelPartner?color=red)]()
[![GitHub stars](https://img.shields.io/github/stars/hruif/TravelPartner?color=yellow)]()

</div>

## 🗺️ Navigation
- [📦 Installation](#-installation)
- [🚀 Quick Start](#-quick-start)
- [🛠️ Developer Guide](#-developer-guide)
- [📝 User Guide](#-user-guide)
- [🐞 Bug Reporting](#-bug-reporting)
- [🛠️ CI and Testing](#-ci-and-testing)
- [🎨 Style Guide](#-style-guide)
- [📜 License](#-license)
- [📢 Acknowledgments](#-acknowledgments)

## 📦 Installation

### Dependencies
To run Globe Gram, install the following:

- [Node.js](https://nodejs.org/en/download)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Docker](https://docs.docker.com/compose/install/)
- [Expo CLI](https://docs.expo.dev/more/expo-cli/)

Additionally, install the MikroORM CLI:
```sh
npm install @mikro-orm/cli
```

## 🚀 Quick Start

### 1️⃣ Start Backend
```sh
cd backend
docker-compose up --build
```
Backend will be accessible at **[http://localhost:3000/api](http://localhost:3000/api)**. Most endpoints require authentication via JWT token, which can be obtained through `/auth/signup` or `/auth/login`.

### 2️⃣ Start Frontend
```sh
cd ../frontend
npm install
npm start
```
Scan the QR code in the terminal with **Expo Go** to launch the app on mobile.

## 🛠️ Developer Guide
For more details, refer to the **[backend](../main/backend/README.md)** and **[frontend](../main/frontend/README.md)** guides. These include:
- Directory structures
- Build instructions
- Testing procedures

## 📝 User Guide

### 🌍 About Globe Gram
Globe Gram is a **social travel-planning app** that helps users explore destinations through other travelers' experiences. Users can:
- Discover travel inspiration from others' photos and tagged locations.
- Filter recommendations based on budget and trip type.
- Create and share their own travel journals.

### ✈️ How to Use
- **Sign Up/Login** using an email and password.
- **Explore the Map** via the home screen button or Map tab.
  - Search locations.
  - View recommendations (coming soon: filter by budget, trip type, etc.).
- **Create a Travel Journal** via the Profile tab.
  - Add a title, description, and upload photos.
  - Choose to share publicly, with friends, or keep private.
- **Return to Home** via the Home tab and **Logout** anytime.

## 🐞 Bug Reporting
To report a bug, use **GitHub Issues**. Follow [Mozilla's Bug Writing Guidelines](https://bugzilla.mozilla.org/page.cgi?id=bug-writing.html) for effective reporting.

📌 **Known Bugs:** Check the [project backlog](https://github.com/users/hruif/projects/1/views/1).

## 🛠️ CI and Testing
We use **GitHub Actions** for continuous integration.

### ✅ CI Pipeline
- **Build Verification:** Ensures frontend and backend compile successfully.
- **Automated Tests:** Run on each push to `main` and for all pull requests.

🔍 View latest runs in the [GitHub Actions tab](https://github.com/hruif/TravelPartner/actions).

## 🎨 Style Guide
- **TypeScript:** [Style Guide](https://ts.dev/style/), Linter: ESLint (@typescript-eslint).
- **NestJS:** [Linting & Formatting](https://awesome-nestjs.com/components-and-libraries/lint.html).
- **Python:** [PEP 8](https://peps.python.org/pep-0008/), Linter: flake8, Formatter: Black.
- **SQL:** [SQL Style Guide](https://docs.telemetry.mozilla.org/concepts/sql_style.html), Formatter: [SQLFluff](https://sqlfluff.com/).

## 📜 License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 📢 Acknowledgments
💙 **Globe Gram is made by [hruif](https://github.com/hruif), [iliyababin](https://github.com/iliyababin), [chloe-mi](https://github.com/chloe-mi), [kam-n](https://github.com/kam-n), [MateoRobinsonn
](https://github.com/MateoRobinsonn), [pencilvulture](https://github.com/pencilvulture).**

