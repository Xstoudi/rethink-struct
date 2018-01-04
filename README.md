# rethink-struct

## Overview
Assert that databases, tables and indexes exists on you RethinkDB server and create it if they don't.

## Support
If you like this package and you like what you see in the ad, please click on it to support `rethink-struct`!


## Requirements
* Async/await support (Node 8 or Node 7 with harmony flag)

## Index support
Currently, `rethink-struct` is the only RethinkDB initialisation package that supports all indexes:
* Simple
* Compound
* Multi
* Geo

## How to assert ?
The package parse your schema and build the database as it should be.
You can find an example of use in the `example.js` file.