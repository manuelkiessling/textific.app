# textific.app

An offline-capable note keeper app built with React/Redux & Node.js.


## Project architecture

### Primary components

* Universal React/Redux application, in `src/universal/`

* Client-side application initializer, in `src/client/`

* HTTP server for Server-Side Rendering & API endpoints, in `src/server/`


## Running the project

In order to provide a working application to the end user, three runtime components are required: a build of the client-side React/Redux application, a build of the SSR server application, and, for now, a mock API server application.


### Locally

#### Full setup

With SSR & API server which also serves all client app assets.

    npm run start:dev:mongodb         # in one terminal session
    npm install --no-save             # in another terminal session
    npm run build:dev:all
    npm run start:dev:server

