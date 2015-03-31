/* jshint esnext:true */
'use strict';
const debug = require('debug')('classes/match');

class Game{
  constructor (id){
    this.id = id;
    this.season = undefined;
    this.round = undefined;
    this.homeScore = undefined;
    this.awayScore = undefined;
    this.homeTeam = undefined;
    this.awayTeam = undefined;
    
  }
  setSeason (str){
	  //input Saison 2014-2015
	  this.season = str.replace(/[^0-9\-]*/g, '');
  }
  setTeams (home, away){
    this.homeTeam = home;
    this.awayTeam = away;
  }
  setScore (home, away){
    this.homeScore = home;
    this.awayScore = away;
  }
  setAttendance (str){
	this.attendance = str && str.length ? str.trim().replace(/[^0-9]*/g, '') || 0 : null;  
  }
  setDate (str){
	//input 25 mars 2015
	let ts = Date.parse(str);
	if (isNaN(ts)){
		this.date = null;
	}
	else{
		this.date = new Date(ts).toISOString();
	}
	  
  }
  toString(){
    let output = '';
    
    if (this.season){
      output += this.season + ' — ';
    }
    if (this.round){
     output += this.round + ' — '; 
    }
    if (this.homeTeam && this.awayTeam){
      output += this.homeTeam.toString()+ ' ';
      if (typeof this.homeScore !== 'undefined' && typeof this.awayScore !== 'undefined'){
        output += this.homeScore + ' - ' + this.awayScore;
      }
      else{
        output += '-';
      }
      output += ' ' + this.awayTeam.toString();
    }
    
    return output;
  }
  
}


module.exports = Game;