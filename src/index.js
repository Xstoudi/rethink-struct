const r = require('rethinkdb')

const { DatabaseElem } = require('./elems/database')
const { TableElem } = require('./elems/table')
const { IndexElem } = require('./elems/index')

class RethinkStruct {
  constructor(schema, conn, debug = false) {
    this.schema = schema
    this.conn = conn
    this.debug = debug

    this.databases = []
  }

  async assert() {
    await this._parseDatabases()
    this.debug('Databases parsed')
    await this._buildDatabases()
    this.debug('Databases built')
    await this._parseTables()
    this.debug('Tables parsed')
    await this._buidlTables()
    this.debug('Tables built')
    await this._parseIndexes()
    this.debug('Indexes parsed')
    await this._buildIndexes()
    this.debug('Indexes built')

    this.debug('Struct asserted')
  }

  _parseDatabases() {
    return new Promise(async (resolve, reject) => {
      const errors = []
      if (this.schema.databases === undefined)
        errors.push('Can\'t find databases definition')
      if (Array.isArray(this.schema.databases) === false)
        errors.push('Databases definition should be an array of string/object')

      this.schema.databases.forEach(database => {
        if (typeof database !== 'string' && database.name === undefined)
          errors.push('Database should be a string or an object with a name')
        this.databases.push(new DatabaseElem(...(typeof database === 'string' ? ([database, null]) : ([database.name, database]))))
      })

      return errors.length > 0 ? reject(errors) : resolve()
    })
  }
  _parseTables() {
    return new Promise(resolve => {
      const databases = this.databases
        .filter(database => database.schema != null)
        .filter(database => database.schema.tables !== undefined)

      databases.forEach(database => {
        database.schema.tables.forEach(table => {
          if (typeof table !== 'string' && table.name === undefined)
            errors.push('Table should be a string or an object with a name')
          database.tables.push(new TableElem(...(typeof table === 'string' ? ([table, null]) : ([table.name, table]))))
        })
      })
      resolve()
    })
  }
  _parseIndexes() {
    return new Promise(resolve => {
      const databases = this.databases
        .filter(database => database.schema != null)
        .filter(database => database.schema.tables !== undefined)

      databases.forEach(database => {
        database.tables
          .map(table => table)
          .filter(table => table.schema != null)
          .filter(table => table.schema.indexes !== undefined)
          .forEach(table => {
            table.schema.indexes.forEach(index => {
              if (typeof index !== 'string' && index.name === undefined)
                errors.push('Indexes should be a string or an object with a name')
              table.indexes.push(new IndexElem(...(typeof index === 'string' ? ([index, null]) : ([index.name, index]))))
            })
          })
      })
      resolve()
    })
  }

  async _buildDatabases() {
    const dbList = await r.dbList().run(this.conn)
    return Promise.all(
      this.databases
        .filter(database => dbList.indexOf(typeof database === 'string' ? database : database.name) === -1)
        .map(database => r.dbCreate(database.name).run(this.conn))
    )
  }
  _buidlTables() {
    const tablesBuilders = []
    this.databases.forEach(async database => {
      const tableList = await r.db(database.name).tableList().run(this.conn)

      tablesBuilders.concat(
        database.tables
          .filter(table => tableList.indexOf(typeof table === 'string' ? table : table.name) === -1)
          .map(table => r.db(database.name).tableCreate(table.name).run(this.conn))
      )
    })
    return Promise.all(tablesBuilders)
  }
  _buildIndexes() {
    const indexesBuilders = []
    this.databases.forEach(database => {
      database.tables.forEach(async table => {
        const indexesList = await r.db(database.name).table(table.name).indexList().run(this.conn)
        table.indexes
          .filter(index => indexesList.indexOf(typeof index === 'string' ? index : index.name) === -1)
          .forEach(index => {
            const type = index.schema == null ? 'simple' : (index.schema.type === undefined ? 'simple' : index.schema.type)

            let indexBuilder
            switch (type) {
              case 'simple':
                indexBuilder = r
                  .db(database.name)
                  .table(table.name)
                  .indexCreate(index.name)
                  .run(this.conn)
                break
              case 'compound':
                if (Array.isArray(index.schema.compound) === true)
                  indexBuilder = r
                    .db(database.name)
                    .table(table.name)
                    .indexCreate(index.name, index.schema.compound.map(fieldName => r.row(fieldName)))
                    .run(this.conn)
                else
                  indexBuilder = Promise.reject('Compound index should have a compound field')
                break
              case 'multi':
                indexBuilder = r
                  .db(database.name)
                  .table(table.name)
                  .indexCreate(index.name, { multi: true })
                  .run(this.conn)
                break
              case 'geo':
                indexBuilder = r
                  .db(database.name)
                  .table(table.name)
                  .indexCreate(index.name, { geo: true })
                  .run(this.conn)
                break
            }

            indexesBuilders.push(indexBuilder)
          })
      })
    })
    return Promise.all(indexesBuilders)
  }

  _debug(message) {
    if (this.debug === true)
      console.log(`[Rethink-Struct] ${message}`)
  }
}

module.exports = { RethinkStruct }