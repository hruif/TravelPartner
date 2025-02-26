# Globe Gram

**Current Release:** [`v0.2.0`](https://github.com/hruif/TravelPartner/releases/tag/v0.2.0)

## Developer Guide
Please read more detailed developer guidelines for the [backend](../main/backend/README.md) and [frontend](../main/frontend/README.md) in their respective READMES. These include:
- directory structures
- more on how to build the software
- testing

### Dependencies
You will need the following dependencies to run the app
- [Node.js](https://nodejs.org/en/download)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Docker](https://docs.docker.com/compose/install/)
- [Expo CLI](https://docs.expo.dev/more/expo-cli/)
- Install Expo Go on your mobile device:
	- For Android: [Expo Go on Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
	- For iOS: [Expo Go on the App Store](https://apps.apple.com/us/app/expo-go/id982107779)

Additionally, you will need to install the MikroORM CLI using the following command:

```bash

npm  install  @mikro-orm/cli

```

### Quick Start
Start Docker, then open a terminal and run the following commands:

1) **Navigate to the backend directory and start the backend.**
```bash

cd backend
docker-compose up --build

```

You can then access the app at **[http://localhost:3000/api](http://localhost:3000/api)**

Most of the endpoints will result in **unauthorized** and will require a **JWT token** to access. You can get a token by using either the **/auth/signup** or **/auth/login** endpoint. You can then **authorize** in the top corner of the Swagger UI, allowing you to access all the endpoints.

2) **Navigate to the frontend directory and start the frontend**:
```bash

cd ../frontend
npm  install
npm  start

```

Now scan the QR code displayed in the terminal or the browser with the Expo Go app.

If you prefer to run the app on an iOS or Android simulator, check [here](../main/frontend/README.md#running-on-a-simulator).

### Testing & Continuous Integration
We use **GitHub Actions** to automatically verify that the project builds correctly on each push and pull request.

### CI Pipeline:
- **Build Verification:** Ensures the backend and frontend compile successfully.
- **Automated Checks:** Runs on each push to `main` and for all pull requests.

You can view the latest runs and logs in the [GitHub Actions tab](https://github.com/hruif/TravelPartner/actions).

### Style Guides
- TypeScript: https://ts.dev/style/. Automated linter: ESLint with a TypeScript configuration (@typescript-eslint).
- TypeScript in NestJS built on ESLint (automatic linter/formatter): https://awesome-nestjs.com/components-and-libraries/lint.html.
- Python: https://peps.python.org/pep-0008/. Automated linter: flake8. Automated formatter: Black.
- SQL: https://docs.telemetry.mozilla.org/concepts/sql_style.html. Automated formatting: https://sqlfluff.com/.

### Living Document
https://docs.google.com/document/d/1QPL-KpL8HGXZmXVWRMLAcBoYqu4GowHgW0gimDIc_YU/edit?usp=sharing

## User documentation
### Description
We are a social travel-planning app. Users planning a trip can be inspired by other travelers’ diaries around that destination, filtering the map according to their budget. Travelers may upload and tag their photos with ease, receive a comprehensive travel diary in return, and share their diary on the map to inspire others.

Our goals:
Our target customers are travelers. Our app offers solutions for 2 problems travelers face:
1) When planning a trip, one often doesn’t know all that they want to do nor all that’s available at their destination. Our app will show users other travelers’ photos at nearby spots for inspiration, accompanied with planning information like pricing, etc.
2) During a trip, days are full of adventure, so there remains little time to preserve these moments’ details in writing, for example. Given photos and tags, our app will return a travel diary. Optionally, users can share these to inspire others.

### (Getting started sections)
Please see the above Developer Guide sections:
- [Dependencies](#dependencies)
- [Quick Start](#quick-start)

### Using software
Functional use cases: 
- Explore recommendations on the map. 
How to use features:
- On the authorization screen, sign up or login via entering an email and password.
- On the home screen, choose from (more functionality to be added)
	- Explore the map via pressing the home screen's button or the bottom Map tab.
		- Search for a location in the world via the search bar or by moving around on the map (slide, zoom). (Future feature: filter recommendations by budget, experience type, etc.)
		- View a recommendation's details by tapping on its map marker (none currently present). (Future feature: add recommendation to itinerary.)
 	- Create a travel recommendation/journal post via pressing the bottom Profile tab. Type a title and description, optionally upload photos (work in progress). (Future feature: choose to add to private profile, friend feed, and/or map database.)
- Return to home screen via the bottom Home tab. May logout from here.
  
### Bugs
**How to report a bug:** GitHub Issues are used to keep track of bugs to fix and desired features to implement. 
Please reference [Mozilla's Bug Writing Guidelines](https://bugzilla.mozilla.org/page.cgi?id=bug-writing.html) for how to write an informative bug report. 

**Known bugs:** please see the [project backlog](https://github.com/users/hruif/projects/1/views/1).
