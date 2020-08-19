FROM cypress/base

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install && npm audit fix

COPY . .

ENV CYPRESS_TEST_FILES **/*.headless.js

RUN npm run cy:verify && npm run cy:run