'use strict'

const cheerio = require('cheerio');
const EventEmitter = require('events').EventEmitter;
const req = require('request');
const iconv = require('iconv');

const MAIN_URL = 'http://www.hearthpwn.com';
const FILTER_OPTIONS =
{
  druid: 4,
  hunter: 8,
  mage: 16,
  paladin: 32,
  priest: 64,
  rogue: 128,
  shaman: 256,
  warlock: 512,
  warrior: 1024,
}

const request = (options, callback) => {
    req(options, function(err, resp, body) {
        var ic = new iconv.Iconv('iso-8859-1', 'utf-8');
        var buf = ic.convert(body);
        var utf8Body = buf.toString('utf-8');
        callback(err, resp, utf8Body);
    });
};

const getFilter = options => {
  return options && options.heroes ? getHeroFilter(options.heroes) : '';
}

const getHeroFilter = heroes => {
  return '?filter-class=' + heroes.reduce((ac, hero) => ac + (FILTER_OPTIONS[hero.toLowerCase()] | 0), 0);
}

const parseDeck = elem => {
  return {
    title: elem.children[0].data,
    url: MAIN_URL+elem.attribs.href
  }
}

const parseCard = elem => {
  return {
    card: elem.children[0].data.trim(),
    quantity: parseInt(elem.parent.next.data.trim().split(' ')[1])
  }
}

/**
 * Returns an array containing the first page of the most popular decks
 * @param {object} options - Options object
 * @returns {EventEmitter}
 */
const getPopularDecks = options => {

  const scraper = new EventEmitter(),
        popularDecksUrl = {'url': MAIN_URL+'/decks'+getFilter(options)};

  request(popularDecksUrl, function(err, resp, body) {
    const $ = cheerio.load(body);
    let popularDecks = [];
    $('tbody')
      .find('a')
      .filter((i) => i % 2 === 0)
      .each((i, elem) => popularDecks.push(parseDeck(elem)));
    scraper.emit('finished', popularDecks);
  });

  return scraper;
}

/**
 * Returns an array containing every card included in the given deck url
 * @param {string} url - Heartpwn deck url
 * @returns {EventEmitter}
 */
const getDeckInfo = url => {

  const scraper = new EventEmitter(),
        deckInfoUrl = {'url': url};

  request(deckInfoUrl, function(err, resp, body) {
    const $ = cheerio.load(body);
    let deckInfo = [];
    $('aside')
      .find('tbody td b a')
      .each((i, elem) => deckInfo.push(parseCard(elem)));
    scraper.emit('finished', deckInfo);
  });

  return scraper;
}

exports.getPopularDecks = getPopularDecks;
exports.getDeckInfo = getDeckInfo;
