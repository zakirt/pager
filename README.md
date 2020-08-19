# Pager - e2e tests

This is an end-to-end testing repo for Pager chat room.

## Running the project

### GitHub Actions

The tests can be deployed using GitHub actions. The workflow name is **browser-e2e.yml**.
You can find it on the [GitHub Actions page](https://github.com/zakirt/pager/actions?query=workflow%3A%22E2E+for+multiple+browsers%22)
The workflow runs tests e2e tests for Chrome, Firefox, and Edge browsers.

### Using NPM

The repo can be cloned and ran locally using Node/NPM.
You will need Node 12+ installed on your machine for this to work.

To run Cypress, enter the following in the terminal:
```
npm run cy:open
```

### Headless tests using docker-compose

Headless API tests can be launched using `docker-compose` command. The **docker-compose.yml** file
contains the necessary configuration. The compose file is minimal right now. It merely creates a **cypress_headless** container. This is a simple example, but can be expanded upon if needed.

make sure you have [Docker](https://www.docker.com/) installed on your machine prior to running the command `docker-compose`.

To run docker-compose, use the following command:
```
docker-compose up -d --build
```

## Notes on the project's architecture

### What is been tested?

I covered the GUI functionality and made sure that the expected DOM elements were on pages.
I also added tests for features that I believe are needed, but are missing.
This includes a test for disabled "Join" button until username is entered and redirect to homepage after "Signout" button is clicked. You can see these two failing tests in **chatRoom.js** and **joinPage.js**.
* "logs out user user and redirect to the join page"
* "should disable "Next" button until username is filled out"

### What could have been done better?

The login mechanism could have been improved to avoid touching the DOM completely.
The task is not straightforward in this case though, since the app is using Web socket mechanism for joining users.
I'll need to do more research on the topic.

