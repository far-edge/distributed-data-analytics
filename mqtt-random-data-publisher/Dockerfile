FROM node:10.1.0

RUN mkdir -p /faredge/mqtt-random-data-publisher
WORKDIR /faredge/mqtt-random-data-publisher

COPY package.json /faredge/mqtt-random-data-publisher
COPY package-lock.json /faredge/mqtt-random-data-publisher
RUN npm install

COPY . /faredge/mqtt-random-data-publisher

EXPOSE ${PORT}

CMD [ "npm", "start" ]
