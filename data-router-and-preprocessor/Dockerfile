FROM node:10.1.0

RUN mkdir -p /faredge/data-router-and-preprocessor
WORKDIR /faredge/RUN mkdir -p /faredge/data-router-and-preprocessor

COPY package.json /faredge/data-router-and-preprocessor
COPY package-lock.json /faredge/data-router-and-preprocessor
RUN npm install

COPY . /faredge/data-router-and-preprocessor

EXPOSE ${PORT}

CMD [ "npm", "start" ]
