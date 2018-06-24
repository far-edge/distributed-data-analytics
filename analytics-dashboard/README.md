**Analytics dashboard** enables users to interact with the Open API for Analytics.

### REQUIREMENTS

* [Node.js](https://nodejs.org/) >= *10.1.0*
* [npm](https://www.npmjs.com/) >= *5.6.0*

### CLONE

    git clone git@github.com:far-edge/distributed-data-analytics.git

### CREATE THE VIRTUAL ENVIRONMENT

    cd distributed-data-analytics/analytics-dashboard
    nodeenv -n 10.1.0 --prebuilt env

### ACTIVATE THE VIRTUAL ENVIRONMENT

    source env/bin/activate

### INSTALL DEPENDENCIES

    npm install

### CONFIGURE

Create `.env` based on `.env.example`.

    cp .env.example .env

Edit `.env`.

### BUILD & DEVELOP

    npm start

### BUILD & DISTRIBUTE

    npm run build

The `dist` folder contains the build to be distributed.

### LINT

    npm run lint

### DEACTIVATE THE VIRTUAL ENVIRONMENT

    deactivate_node
