**Open API for Analytics** defines a set of public endpoints that enable external systems to
interact with the Distributed Data Analytics component both at the edge and at the ledger tier, and
deploy their own custom data analytics logic.

### REQUIREMENTS

* [Confluent Platform](https://www.confluent.io) >= *4.1.1*
* [MongoDB](https://www.mongodb.com/) >= *3.6.4*
* [Node.js](https://nodejs.org/) >= *10.1.0*
* [npm](https://www.npmjs.com/) >= *5.6.0*
* [Docker CE](https://www.docker.com/community-edition) >= 18.03.1 *(optional)*
* [Docker Compose](https://docs.docker.com/compose/) >= 1.21.0 *(optional)*

### CLONE

    git clone git@github.com:far-edge/distributed-data-analytics.git

### CONFIGURE

Create `.env` based on `.env.example`.

    cp .env.example .env

Edit `.env`.

### WORK WITH DOCKER

#### RUN

    cd distributed-data-analytics/open-api-for-analytics
    docker-compose up

### WORK WITHOUT DOCKER

#### CREATE THE VIRTUAL ENVIRONMENT

    cd distributed-data-analytics/open-api-for-analytics
    nodeenv -n 10.1.0 --prebuilt env

#### ACTIVATE THE VIRTUAL ENVIRONMENT

    . env/bin/activate

#### INSTALL THE DEPENDENCIES

    npm install

#### RUN

    npm start

#### DEACTIVATE THE VIRTUAL ENVIRONMENT

    deactivate_node

#### LINT

    npm run lint

#### TEST

    npm test

#### GENERATE THE DOCUMENTATION

    npm run doc
