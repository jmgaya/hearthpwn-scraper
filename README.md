# hearthpwn-scraper

hearthpwn-scraper features:
  - Get current most popular decks
  - Get deck info given an URL


# Installing
```
npm install hearthpwn-scraper --save
```

# Examples
```js
var hearthpwn = require('hearthpwn-scraper');

var sraper = hearthpwn.getPopularDecks();
sraper.on('finished', function(popularDecks) {
    console.log(popularDecks);
});

scraper = hearthpwn.getDeckInfo('http://www.hearthpwn.com/decks/422747-top-100-patron-by-mariohs-guide-mini-guide-in');
scraper.on('finished', function(deckInfo) {
    console.log(deckInfo);
});
```


## getPopularDecks(options)

```js
var hearthpwn = require('hearthpwn-scraper');
var options = {
    heroes: ['priest', 'paladin']
};

var scraper = hearthpwn.getPopularDecks(options);
scraper.on('finished', function(popularDecks) {
    console.log(popularDecks);
});
```
