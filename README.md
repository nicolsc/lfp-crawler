#LFP Crawler

##What

Crawl data from the [French Football League](http://lfp.fr) webiste, and store the data in a Postgres db.

Then ... do whatever processing on these historical data

###Data retrieved

*French 1st league*

* All scores since 1932-33
* Dates & attendances when available

##How

* [io.js](https://iojs.org/en/index.html)
* [Express](http://expressjs.com/) framework
	* App is generated with the express generator
* [PostgreSQL](http://www.postgresql.org/) database
* [jsdom](https://www.npmjs.com/package/jsdom) to crawl the webpages content
	* Will switch to a *serious* crawler later, spider or else.


##Run

I'm using this project to experiment with the new ES6 standards : promises, classes et al.  
As i'm trying to get my mind around the ES6 classes, the --harmony flag is needed.  
And as the app was generated with the default settings of the express generator, it's coming with the debug package.  Meaning you need to set the DEBUG env var to * to get the verbose output. Which is more than needed as i'm just starting to get the whole thing working


```
 $ DEBUG=* node --harmony scripts/crawl.js {id}
```

