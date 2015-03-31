/* jshint esnext:true */
'use strict';
const jsdom = require('jsdom');
const debug = require('debug')('lfp');

const Team = require('../classes/team');
const Game = require('../classes/game');

const rankingUrl = 'http://www.lfp.fr/ligue1/classement#sai=:id';
const gameUrl = 'http://www.lfp.fr/ligue1/feuille_match/:id';


const cssPaths = {
 gameStats : '.box.match_stats' 
};

module.exports = {
  getCompetitionTeams: function(id){
    let url = rankingUrl.replace(/:id/, id);
	let teams = [];
	return new Promise(function (resolve, reject){
		this.jsdomUrl(url)
		.then(function(window){
			window.$('.club a').each(function(idx,entry){
				teams.push(new Team(entry.href.split('/').pop(), entry.textContent.trim()));
			});
			resolve(teams);
		})
		.catch(reject)
	}.bind(this));
  },
  getGame: function(id){
    let url = gameUrl.replace(/:id/, id);
	  
	return new Promise(function(resolve, reject){
		this.jsdomUrl(url)
		.then(function(window){
			this.fetchgameInfosFromDOM(window)
			.then(resolve)
			.catch(reject);
		}.bind(this))
		.catch(reject);
	}.bind(this));
  },
  jsdomUrl: function(url){
	return new Promise(function(resolve, reject){
      jsdom.env({
        url : url,
        scripts: ['http://code.jquery.com/jquery.js'],
        done : function(err, window){
          if (err){
            reject(new Error(err));
          }
          else{
            resolve(window);
          }
        }
      });
    });
	  
  },
  fetchgameInfosFromDOM: function(window){
    const $ = window.$;
    const gameStats = window.$(cssPaths.gameStats);
    const id = $('#match_id_hidden').val() | 0;
    
    let tmp;
    
    let game = new Game(id);
    
    game.setTeams(this.getTeam('dom',gameStats, $), this.getTeam('ext',gameStats, $));
    game.setScore(this.getScore('dom', gameStats, $), this.getScore('ext', gameStats, $));
    
    //game details
	tmp = this.getGameInfos(gameStats, $);
	game.setSeason(tmp[0]);
    game.round = tmp[1];
    game.setDate(tmp[2]);
    game.venue = tmp[3];
    game.setAttendance(tmp[4]);
    return new Promise(function(resolve, reject){
	  resolve(game);
    });
  },
  getTeam: function(domext, DOMData, $){
    const id = $('#'+domext+'_id_hidden', DOMData).val() | 0;
    const name = $('.club_'+domext+' .club', DOMData).text();
    return new Team(id, name);
  },
  getScore: function(domext, DOMData, $){
    const val = parseInt($('.club_'+domext+' .buts').text());
	if (isNaN(val)){
		return null;
	}
	else{
		return val;
	}
  },
  getGameInfos: function(DOMData, $){
    return $('p', DOMData).first().text().split(' - ')
    .concat($('p:nth-child(3)', DOMData).text().split(' - '))
    .concat($('p:nth-child(4)', DOMData).text().split('/'));
  }
};