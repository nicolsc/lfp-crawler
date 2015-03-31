/* jshint esnext:true */
'use strict';
const debug = require('debug')('crawl');
const lfp = require('../modules/lfp');
const db = require('../modules/db.js');

const MATCH_ID = process.argv[2];

if (!MATCH_ID || isNaN(parseInt(MATCH_ID))){
	debug('Missing argument MATCH_ID');
	debug('Valid Syntax:');
	debug('~$ node crawl.js {MATCH_ID}');
	debug('MATCH_ID must be a numeric value');
	process.exit(1);
}
//How many async operations must be completed before process.exit(0)
const operationsPerGame = 3;
const countdown = 1 * operationsPerGame;
const end = delayedCallback(countdown, function(){
	debug('~~~ THE END ~~~');
	process.exit(0);
});

function delayedCallback(countdown, func){
  return function(){
	if (--countdown <= 0){
      func.apply(this, arguments);
    }
  };
}

function crawl(id){
  debug('Crawl game #'+id);
  lfp.getGame(id)
  .then(
    function(match){
      debug(match.toString());
      
      db.game.upsert(match)
	  .then(function(result){
		debug('Game upsert OK');
		debug(result);
		end();
	  })
	  .catch(function(err){
		debug('Game upsert KO');
		debug(err);
		end();
	  });
	  db.team.upsert(match.homeTeam.id, match.homeTeam).then(end).catch(end);
      db.team.upsert(match.awayTeam.id, match.awayTeam).then(end).catch(end);
      
    }
  )
  .catch(
    function(err){
    	debug('Err: '+err);
		for (let i=0; i<operationsPerGame;i++){end();}
      	//process.exit(1);
			
    }
  );
}

db.connect()
.catch(function(err){
  debug('Error while connecting to the db');
  debug(err);
  process.exit(1);
})
.then(function(client){
  crawl(MATCH_ID); 
//lfp.getCompetitionTeams(81)
.then(process.exit).catch(process.exit);
});
