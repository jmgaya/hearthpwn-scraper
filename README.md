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
const hearthpwn = require('./lib/hearthpwn-scraper');

hearthpwn.getPopularDecks()
  .then(popularDecks => console.log(popularDecks));

hearthpwn.getDeckInfo('http://www.hearthpwn.com/decks/422747-top-100-patron-by-mariohs-guide-mini-guide-in')
  .then(deckInfo => console.log(deckInfo));
```


## getPopularDecks(options)

```js
const hearthpwn = require('hearthpwn-scraper');
const options = {
    heroes: ['priest', 'paladin']
};

hearthpwn.getPopularDecks(options);
  .then(popularDecks => console.log(popularDecks));
```
