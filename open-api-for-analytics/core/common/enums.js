// Enums.
class Enum {
  constructor(values) {
    values.forEach((v) => {
      this[v] = v;
    });
    this.ALL = values;
  }
}

module.exports = Enum;
