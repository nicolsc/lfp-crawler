/**
* Create tables :
* - team
* - match
* - stadium
* - stadium_capacity
**/
create table if not exists teams(
  id integer primary key,
  name varchar(50)
);


create table if not exists games(
  id integer primary key,
  competition char(3) null,
  date  timestamp with time zone null,
  attendance smallint,
  team1 integer not null,
  team2 integer not null,
  score1 integer null,
  score2 integer null,
  season char(9),
  stadium varchar(100) null,
  foreign key (team1) references teams (id),
  foreign key (team2) references teams (id)
);