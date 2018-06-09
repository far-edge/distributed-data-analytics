FROM node:10.1.0

RUN mkdir -p /faredge/random-data-generator
WORKDIR /faredge/random-data-generator

COPY package.json /faredge/random-data-generator
COPY package-lock.json /faredge/random-data-generator
RUN npm install

COPY . /faredge/random-data-generator

EXPOSE ${PORT}

CMD [ "npm", "start" ]
