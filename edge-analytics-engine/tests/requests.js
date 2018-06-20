const assertions = require('./assertions');

// Send a DELETE request.
const cdelete = (app, url) => {
  return assertions.request(app).delete(url);
};

// Send a GET request.
const cget = (app, url) => {
  return assertions.request(app).get(url);
};

// Send a PATCH request.
const cpatch = (app, url, data) => {
  return assertions.request(app).patch(url).send(data);
};

// Send a POST request.
const cpost = (app, url, data) => {
  return assertions.request(app).post(url).send(data);
};

// Send a PUT request.
const cput = (app, url, data) => {
  return assertions.request(app).put(url).send(data);
};

module.exports = {
  cdelete,
  cget,
  cpatch,
  cpost,
  cput
};
