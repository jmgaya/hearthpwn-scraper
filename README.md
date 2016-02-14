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

var sraper = hearthpwn.getPopularDecks(options);
sraper.on('finished', function(popularDecks) {
    console.log(popularDecks);
});
```


# Todo
Use Fetch API: https://developer.mozilla.org/en/docs/Web/API/Fetch_API
