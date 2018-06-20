// Sends a response based on whatever has been put on res.locals.
const respond = (_req, res, _next) => {
  res.status(res.locals.code);
  const headers = res.locals.headers;
  const content = res.locals.content;
  res.set(headers);
  if (headers['Content-Type'] === 'application/json') {
    if (content) {
      res.json(content);
    } else {
      res.send();
    }
  } else {
    const buffer = content instanceof Buffer ? content : new Buffer(content, 'binary');
    res.end(buffer);
  }
};

module.exports = respond;
