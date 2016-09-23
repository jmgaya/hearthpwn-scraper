'use strict';

var cheerio = require('cheerio');
var req = require('request');
var iconv = require('iconv');

var MAIN_URL = 'http://www.hearthpwn.com';
var FILTER_OPTIONS = {
  druid: 4,
  hunter: 8,
  mage: 16,
  paladin: 32,
  priest: 64,
  rogue: 128,
  shaman: 256,
  warlock: 512,
  warrior: 1024
};

var request = function request(options, callback) {
  req(options, function (err, resp, body) {
    var ic = new iconv.Iconv('iso-8859-1', 'utf-8');
    var buf = ic.convert(body);
    var utf8Body = buf.toString('utf-8');
    callback(err, resp, utf8Body);
  });
};

var getHeroFilterSummatory = function getHeroFilterSummatory(heroes) {
  return heroes.reduce(function (ac, hero) {
    return ac + (FILTER_OPTIONS[hero.toLowerCase()] | 0);
  }, 0);
};

var getHeroFilter = function getHeroFilter(heroes) {
  return '?filter-class=' + getHeroFilterSummatory(heroes);
};

var getFilter = function getFilter(options) {
  return options && options.heroes ? getHeroFilter(options.heroes) : '';
};

var parseDeck = function parseDeck(elem) {
  return Object.freeze({
    title: elem.children[0].data,
    url: MAIN_URL + elem.attribs.href
  });
};

var parseCard = function parseCard(elem) {
  return Object.freeze({
    card: elem.children[0].data.trim(),
    quantity: parseInt(elem.parent.next.data.trim().split(' ')[1], 10)
  });
};

/**
 * Returns an array containing the first page of the most popular decks
 * @param {object} options - Options object
 * @returns {Promise}
 */
var getPopularDecks = function getPopularDecks(options) {
  return new Promise(function (resolve, reject) {
    var popularDecksUrl = { url: MAIN_URL + '/decks' + getFilter(options) };

    request(popularDecksUrl, function (err, resp, body) {
      if (err) {
        reject(err);
      } else {
        (function () {
          var $ = cheerio.load(body);
          var popularDecks = [];
          $('tbody').find('a').filter(function (i) {
            return i % 2 === 0;
          }).each(function (i, elem) {
            return popularDecks.push(parseDeck(elem));
          });
          resolve(popularDecks);
        })();
      }
    });
  });
};

/**
 * Returns an array containing every card included in the given deck url
 * @param {string} url - Heartpwn deck url
 * @returns {Promise}
 */
var getDeckInfo = function getDeckInfo(url) {
  return new Promise(function (resolve, reject) {
    var deckInfoUrl = { url: url };

    request(deckInfoUrl, function (err, resp, body) {
      if (err) {
        reject(err);
      } else {
        (function () {
          var $ = cheerio.load(body);
          var deckInfo = [];
          $('aside').find('tbody td b a').each(function (i, elem) {
            return deckInfo.push(parseCard(elem));
          });
          resolve(deckInfo);
        })();
      }
    });
  });
};

exports.getPopularDecks = getPopularDecks;
exports.getDeckInfo = getDeckInfo;