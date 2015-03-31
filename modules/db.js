/* jshint esnext:true*/
'use strict';

const pg = require('pg');
const url = require('url');
const debug = require('debug')('db');


let dbInfos = url.parse(process.env.DATABASE_URL || 'postgres://ligue1:moustache@localhost/ligue1_stats');
dbInfos.auth = dbInfos.auth ? dbInfos.auth.split(':') : [null, null];
dbInfos.dbname = dbInfos.path.replace(/^\//, '');
 
var dbClient;


module.exports = {
  connect : function() {
    dbClient = new pg.Client({
      user: dbInfos.auth[0],
      password: dbInfos.auth[1],
      database: dbInfos.dbname,
      port: dbInfos.port,
      host: dbInfos.hostname,
      ssl: false
    }); 
    return new Promise(function(resolve, reject){
      dbClient.connect(function(err, client){
        if (err){
          return reject(err);
        }
        resolve(client);
      });
    });
  },
  game:{
    create: function (data){
		debug('Game.create');
		return new Promise(function(resolve, reject){
			const qry = dbClient.query(this.getInsertQry(), this.getParams(data));	
			qry.on('error', function(err){
				debug(':( #1');
				reject(err);
				
			});
			qry.on('end', function(result){
				debug(':) #1');
				resolve(result);
			});
			
		}.bind(this));
    },
    update: function (id, data){
		debug('Game.update');
      return new Promise(function(resolve, reject){
        const qry = dbClient.query(this.getUpdateQry(), this.getParams(data));
        qry.on('end', resolve);
        qry.on('error', reject);
		  debug(data);
		  debug(this.getParams(data));
      }.bind(this));
    },
	upsert: function(game){
		debug('Game.upsert');
		return new Promise(function(resolve, reject){
			this.update(game.id, game)
			.then(function(result){
				if (result.rowCount === 0){
					this.create(game)
					.then(function(result){
						debug('∞');
						debug(result);
						resolve(result);
					})
					.catch(function(err){
						debug(':(');
						debug(err);
						reject(err);
					});
				}
				else{
					resolve('update');	
				}
			}.bind(this))
			.catch(reject);
		}.bind(this));
	},
    delete: function (id){
      return new Promise(function(resolve, reject){
		  reject(new Error('501 - Not implemented yet'));
	  });
    },
	getInsertQry: function(){
		return 'insert into games (id, competition, date, attendance, team1, team2, score1, score2, season, stadium) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
	},
	getUpdateQry: function(){
		return 'update games set competition=$2, date=$3, attendance=$4, team1=$5, team2=$6, score1=$7, score2=$8, season=$9, stadium=$10 where id=$1 returning id';
	},
	getParams:function(game){
	  let params = [];
	  params.push(game.id);
	  params.push(game.competition || null);
	  params.push(game.date || null);
	  params.push(game.attendance || null);
	  params.push(game.homeTeam.id);
	  params.push(game.awayTeam.id);
	  params.push(typeof game.homeScore!=='undefined' ? game.homeScore : null);
	  params.push(typeof game.awayScore!=='undefined' ? game.awayScore : null);
	  params.push(game.season);
	  params.push(game.venue);
//	  debug(game);
//      debug(params);
	
	  return params;
		
	}
  },
  stadium: {
	create: function (name){
      return new Promise(function(resolve, reject){
        const qry = dbClient.query('insert into stadiums (name) values ($1)',[name]);
        qry.on('error', reject);
        qry.on('end', resolve);
      });
    },
    update: function (id, data){
      return new Promise(function(resolve, reject){
        const qry = dbClient.query('update stadiums set name=$2 where id=$1 returning id', [id, data.name]);
        qry.on('end', resolve);
        qry.on('error', reject);
      });
    },
	upsert: function (name){
      return new Promise(function(resolve, reject){
        const qry = dbClient.query('select count(*) from stadiums where name=$1', [name]);
		qry.on('row', function(row){
			//We`re expecting 1 row only, as its a count(*)
			if (row.count > 0){
				debug(name + 'already exists in db');
				resolve('exists');
			}
			else{
				debug('Need to create stadium ' + name);
				this.create(name)
				.then(resolve)
				.catch(reject);
			}
		}.bind(this));
		qry.on('error', function(err){reject(err);});
      }.bind(this));
    },
    delete: function (id){
      return new Promise(function (resolve, reject){
		  reject(new Error('501 - Not implemented yet'));
	  }.bind(this));
    }
  },
  team:{
    create: function (data){
      return new Promise(function(resolve, reject){
        const qry = dbClient.query('insert into teams (id, name) values ($1, $2)',
                                  [data.id, data.name]);
        qry.on('error', reject);
        qry.on('end', resolve);
      });
    },
    update: function (id, data){
      return new Promise(function(resolve, reject){
        const qry = dbClient.query('update teams set name=$2 where id=$1 returning id', [id, data.name]);
        qry.on('row', function(row){
         // debug('Got a row', row);
        });
        qry.on('end', resolve);
        qry.on('error', reject);
      });
    },
    upsert: function (id, data){
      return new Promise(function(resolve, reject){
        this.update(id, data)
		.catch(function(err){reject(err);})
        .then(function(result){
          if (result.rowCount === 0){
			  
			debug(data.name+' '+result.rowCount+' rows');
			//insert it !
            this.create(data)
            .then(resolve)
            .catch(reject);
          }
          else{
            debug('Updated '+data.name);
            resolve(result);
          }
          
        }.bind(this));
      }.bind(this));
    },
    delete: function (id){
      return new Promise(function (resolve, reject){
		  reject(new Error('501 - Not implemented yet'));
	  }.bind(this));
    }
  }
};