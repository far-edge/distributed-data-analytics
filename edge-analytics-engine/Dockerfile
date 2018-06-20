FROM node:10.1.0

RUN mkdir -p /faredge/edge-analytics-engine
WORKDIR /faredge/RUN mkdir -p /faredge/edge-analytics-engine

COPY package.json /faredge/edge-analytics-engine
COPY package-lock.json /faredge/edge-analytics-engine
RUN npm install

COPY . /faredge/edge-analytics-engine

EXPOSE ${PORT}

CMD [ "npm", "start" ]
