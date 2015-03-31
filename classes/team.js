/* jshint esnext:true */
'use strict';
const debug = require('debug')('classes/team');


class Team extends Object{
  constructor (id, name){
    this.id = id;
    this.name = name;
  }
  toString(){
   return this.name; 
  }
}

module.exports = Team;