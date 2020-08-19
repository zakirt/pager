# Pager - e2e tests

This is an end-to-end testing repo for Pager chat room.

## Running the project

### GitHub Actions

The tests can be deployed using GitHub actions. The workflow name is **browser-e2e.yml**.

### Using NPM

The repo can be cloned and ran locally using Node/NPM.
You will need Node 12+ installed on your machine for this to work.

To Cypress enter:
```
npm run cy:open
```

### Headless tests using docker-compose

Headless API tests can be launched using `docker-compose` command. The **docker-compose.yml** file
contains the necessary configuration. The compose file is minimal right now. It merely creates a **cypress_headless** container. This is a simple exmaple, but can be expanded upon if needed.

make sure you have [Docker](https://www.docker.com/) installed on your machine prior to running the command `docker-compose`.

To run docker-compose, use the following command:
```
docker-compose up -d --build
```

## Notes on the project's architecture

### What is been tested?

I covered the GUI functionality and made sure that the expected DOM elements were on the page.
I also added tests that test for features that I believe are needed, but are missing.
This includes a test for disabled "Join" button until username is entered and redirect to homepage after "Signout" button is clicked.

### What could have been done better?

The login mechanism could have been improved to avoid touching the DOM completely.
The task is not straightforward in this case though, since the app is using Web socket mechanism for joining users.
I'll need to do more research on the topic.

