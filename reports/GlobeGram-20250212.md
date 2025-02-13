# Meeting Agenda
- We are considering rolling back our schedule a bit. Setting up backend/frontend is taking more time than initially laid out, so we still need to integrate and display our map on the UI. We may then push our user upload and recommendation tasks to later dates.
- Any tips/specific goals as we polish our 1st major use case for demo (beyond what's in the beta release spec)?
Thank you, Celestine! 

# Project Status
## Goals for this week
- Continue setting up code foundation: develop user authentication and API architecture (back end) and UI framework (front end).
- Map integration: integrate API and display on UI.
- Finish "Testing and continuous integration" writing in living doc.
## Progress and issues
- Backend: 
- Frontend UI progress: Set up framework: Expo with React Native. (Old issue: We don't all have Macs, so could not compile/preview our iOS app. Solution: Use the Expo framework.)
- Map integration issue: We are still working on backend and frontend components separately, so were not ready to integrate them yet. This will stay our next goal.
- Testing and CI progress: Completed setup/written work! 
## Goals for next week
- Map integration: Display map on UI.
- Beta release: Finish implementing core components (map, recommendation system, journal); demo 1 major use case (explore recommendations on the app).

# Individual Progress and Plans
## Kam
### Goals for this week
- Assist with making sure the CI and testing works properly.
- Finish React Native tutorials and work on getting a basic UI up.
### Progress and issues
- Integrated Node.js CI and Jest along with adding some other minor backend dependencies/fixes.
- Worked through some React Native tutorials and using ExpoGo with it.
### Goals for next week
- Make sure we have a useable basic UI for the upcoming beta that works with the backend Google Maps API.

## Mateo
### Goals for this week
  - Implemented google maps for the backend, along with a simple implmentation of a specific location in the frontend where the user can interact with according to their devices make (e.g iphone, android) through react-native-maps currently but will be switched over to google-maps shortly.
  - created a README file for the frontend to explain setup of the frontend for ease of use.
### Progress and issues
  - We found an issue with docker where it wouldn't install/run the build for the backend for nestjs but was able to fix it during the following days after finding out.
  - implemented a basic map with no search functionality.
### Goals for next week
- For next week I will have google maps fully implemented along with hopefully the search functionailty.
- Implementing the markers that showcase the most popular destinations locally.
## Rui
### Goals for this week
  
### Progress and issues
- 
  
### Goals for next week
- 

## Chloë
### Goals for this week
- Finish React Native tutorial.
- Help develop UI framework.
  
### Progress and issues
- Finished several tutorials (refresher on Javascript, React Native).
- Set up UI framework.
- Wrote testing and CI work in living doc. Helped choose and start to integrate CI service. 
  
### Goals for next week
- Flesh out UI foundation.
- Help display map on UI. 

## Iliya
### Goals for this week
- Plan out CI/CD and how that will interop with our testing frameworks
- Setup CI in a way to also report code coverage and not allow pushes if below certain threshold.
  
### Progress and issues
- The CI wouldn't can't properly start the backend to test it.
- The docker container used the users local files which could result in error if not built.
  
### Goals for next week
- Implement user accounts along with proper security handling and password storing

## Nathan
### Goals for this week
  
### Progress and issues
- 
  
### Goals for next week
-     
