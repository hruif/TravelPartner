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
- [📝 User Guide](#-user-guide)
- [🛠️ Developer Guide](#-developer-guide)
- [🐞 Bug Reporting](#-bug-reporting)
- [🛠️ CI and Testing](#-ci-and-testing)
- [🎨 Style Guide](#-style-guide)
- [✅ Completed Features/Functionality](#-completed-featuresfunctionality)
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

## 📝 User Guide

### 🌍 About Globe Gram
Globe Gram is a **social travel-planning app** that helps users plan via exploring other travelers' experiences. Features:
- **A glance** at popular destinations in the home page. (Corresponding posts to be added later.)
- **A map** to visually explore and mark destinations. A visual of locations to visit, order in which to visit them, and their geographic relationship to each other. 
- **An itinerary** where destinations found on the map can be saved.
- **Filter the map** based on the itinerary's budget. 
- **Profile** where a new **journal** for each trip can be created to preserve memories. **Journal entries** document a particular experience in a trip. Entries can include a title, date, photo, description, tags for types of experiences, price, and star rating.

### ✈️ How to Use
- **Sign up/login** using an email and password.
- **Tap a popular destination tab** in the home screen to see exciting experience entries. 
- **Explore the map and build an itinerary** via pressing the logo on the bar, then navigating to the Map tab.
  - Enter a destination for the trip to plan.
  - Choose the map view.
  - Search locations to see on the map. See photos of that location.
  - Press "+" to save that location to the itinerary.
  - Choose the itinerary view to see saved locations listed.
  - In the map view, saved locations are marked with numbers in the order they were added, and connected by edges to show their geographic relationship. 
  - Filter by the itinerary's budget. 
- **Create a new travel journal** in the profile screen. Name it.
  - Select a journal in the row of journal names to see that trip's entries.
  - Press the make-an-entry button to make a new entry in the selected journal. Fill in the (optional) entry details: title, date, location, photo, description, toggle experience type tags, price, and star rating. Press publish.
  - Entries can be edited and deleted.
- **Logout** from the profile screen's bottom. 

## 🛠️ Developer Guide
For more details, refer to the **[backend](../main/backend/README.md)** and **[frontend](../main/frontend/README.md)** guides. These include:
- Directory structures
- Build instructions
- Testing procedures

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

## ✅ Completed Features/Functionality

- **Interactive map** which allows users to explore travel recommendations.
- Users can **upload photos**, tag them with location, experience type, price, rating, and  optionally a summary or personal story.
- Users have **profiles** so they can see all of their travel diaries from each of their trips. 
- **Filter recommendations** by budget.
- Users can **add recommendations to their itinerary**, seeing a visual layout of their schedule.

### Issues/Feedback Addressed
- More frequent usage of GitHub issues for bug tracking.
- Frontend tests and instructions added for CI.
- Documentation edited to be more detailed and also easier to follow/understand.
- Travel diary posting functionality fixed.
- Keyboard stuck on travel diary issue fixed.

## 📜 License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 📢 Acknowledgments
💙 **Globe Gram is made by [hruif](https://github.com/hruif), [iliyababin](https://github.com/iliyababin), [chloe-mi](https://github.com/chloe-mi), [kam-n](https://github.com/kam-n), [MateoRobinsonn
](https://github.com/MateoRobinsonn), [pencilvulture](https://github.com/pencilvulture).**

