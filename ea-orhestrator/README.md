EA-orchestrator is the component that provides the runtime environment for Edge Analytics.

### REQUIREMENTS

* [Confluent](https://www.confluent.io) >= *4.0.0*
* [MongoDB](https://www.mongodb.com/) >= *3.4.3*
* [Node.js](https://nodejs.org/) >= *9.2.0*
* [nodeenv](https://github.com/ekalinin/nodeenv) >= *1.1.4*
* [npm](https://www.npmjs.com/) >= *5.5.1*

### CLONE

    git clone git@github.com:far-edge/EdgeAnalyticsEngine.git

### CREATE THE VIRTUAL ENVIRONMENT

    cd ea-orchestrator
    nodeenv env

### ACTIVATE THE VIRTUAL ENVIRONMENT

    . env/bin/activate

### INSTALL DEPENDENCIES

    npm install

### Start Confluent services.

    cd ${CONFLUENT_HOME}
    ./bin/confluent start

where `CONFLUENT_HOME` is the absolute path to the Confluent directory
(e.g. `/Applications/confluent-4.0.0`).

### CONFIGURE

Create `.env` based on `.env.example`.

    cp .env.example .env

Edit `.env`.

### RUN (DEVELOPMENT)

    npm start

### RUN (PRODUCTION)

    node --require dotenv/config server.js

### LINT

    npm run lint

### DEACTIVATE THE VIRTUAL ENVIRONMENT

    deactivate_node

### Stop Confluent services.

    cd ${CONFLUENT_HOME}
    ./bin/confluent stop
