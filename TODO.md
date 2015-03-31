#Process

* Start with a season id
* Get the teams list first
	* Don't upsert teams & match at the same time as done now, as the game.insert will fail if the team isn't inserted yet (pk constraint)
* Find a way to get their *id*
	* The current lfp.getCompetitionTeams doesn't get them, as the links are /club/club-name and not /club/:id
* Once teams are OK, fetch the results round by round


#Teams list
The [ranking page](http://www.lfp.fr/ligue1/classement#sai=:seasonid)  seems nice, but it doesn't give the teams ids.
* Do we really need them ? *


#Round infos

[Link](http://www.lfp.fr/ligue1/calendrier_resultat#sai=:seasonid&jour=:roundnumber)
###Loop 
	$('#tableaux_rencontres tr')

###Get ID

	$('.stats a').attr('href').split('/').pop()
	
###Crawl game
	node crawl.js {idø

#Loop rounds

$('select#journee option')

##Get ID
.val()


#Loop seasons
[Link](http://www.lfp.fr/ligue1/calendrier_resultat#sai=:seasonid&jour=1)

$('#select#saison option')

##Get ID
	.val()

