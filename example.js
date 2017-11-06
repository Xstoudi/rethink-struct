(async () => {
  const { RethinkStruct } = require('./index')

  const schema = {
    databases: [
      'db1',
      'db2',
      {
        name: 'db3',
        tables: [
          {
            name: 'table3',
            indexes: ['index1']
          },
          {
            name: 'table4',
            indexes: [
              {
                name: 'index2'
              }, {
                name: 'index3',
                type: 'simple'
              }, {
                name: 'index4',
                type: 'compound',
                compound: ['x', 'y']
              }, {
                name: 'index5',
                type: 'multi'
              }, {
                name: 'index6',
                type: 'geo'
              }
            ]
          }
        ]
      },
      {
        name: 'db4',
        tables: ['table1', 'table2']
      }
    ]
  }
  const rethink = require('rethinkdb')
  const rethinkConn = await rethink.connect()
  const x = new RethinkStruct(schema, rethinkConn, true)
  x.assert()
})()