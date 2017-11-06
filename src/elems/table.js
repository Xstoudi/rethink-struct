class TableElem {
  constructor(name, schema) {
    this.name = name
    this.schema = schema

    this.indexes = []
  }
}

module.exports = { TableElem }