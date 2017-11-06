class DatabaseElem {
  constructor(name, schema) {
    this.name = name
    this.schema = schema
    this.tables = []
  }
}

module.exports = { DatabaseElem }