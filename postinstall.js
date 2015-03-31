/* jshint esnext:true */
'use strict';
const db = require('./modules/db');
const fs = require('fs');

console.log('Postinstall');
db.connect()
.then(function(client){
  console.log('db connection OK');
  
  var initSQL = fs.readFileSync('./sql/init.sql', {encoding:'utf-8'});
  client.query(initSQL, function (err){
    if (err) {
     console.warn('An error occured while initalizing the DB : \n %s', err); 
     process.exit(1);  
    }
    console.log('\u001b[32m♡\u001b[49m');
    process.exit(0);
  });
  
})
.catch(function(err){
  console.error('Unable to connect to %s', err);
  throw err;
});