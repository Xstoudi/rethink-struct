# rethink-struct

## Overview
Assert that databases, tables and indexes exists on you RethinkDB server and create it if they don't.

## Support
If you like this package and you like what you see in the ad, please click on it to support `rethink-struct`!
<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/RFZm26J558vLyi6jH9gt7X9F/Xstoudi/rethink-struct'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/RFZm26J558vLyi6jH9gt7X9F/Xstoudi/rethink-struct.svg' />
</a>

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