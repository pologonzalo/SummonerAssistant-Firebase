const functions = require('firebase-functions');
const _ = require('lodash')


// FUNCTIONS 
const champions = require('./lib/champions')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const API_RIOT_KEY = 'RGAPI-639291ee-9f27-42bc-8ce6-249a0e3b956d'
const BASE_EUW = 'https://euw1.api.riotgames.com'


// DEV purposes
const SUMMONER_ID = 63749117


exports.getSummonerSummaryRanked = functions.https.onRequest((req, res) => {
  const { region } = req.query
  if (!region) return res.status(400).send('Missing region')

  const gg = require('./lib/Parser')

  gg.SummaryRankedGames({ region, summonerId: SUMMONER_ID })
    .then((json) => {
      return res.send(json)
    })
    .catch((error) => {
      console.error(error)
    })
})

exports.getSummaryMostFrequentChampions = functions.https.onRequest((req, res) => {
  const { region, summonerId, season = '11', type = 'ranked' } = req.query
  if (!region) return res.status(400).send('Missing region')
  if (!type || (type !== 'ranked' && type !== 'flexranked5v5' && type !== 'flexranked3v3' && type !== 'soloranked')) {
    return res.status(400).send('Invalid param <type>, please use one of: ranked, flexranked5v5, flexranked3v3, soloranked')
  }
  if (!summonerId) return res.status(400).send('Missing region')

  champions.getSummaryMostFrequentChampions({ region, type, summonerId, season })
    .then(champions => {
      return res.send(champions)
    })
    .catch((error) => {
      console.error(error)
    })
})

exports.getMostFrequentChampions = functions.https.onRequest((req, res) => {
  const { region, summonerId, season = '11', type = 'ranked' } = req.query
  if (!region) return res.status(400).send('Missing region')
  if (!type || (type !== 'ranked' && type !== 'flexranked5v5' && type !== 'flexranked3v3' && type !== 'soloranked')) {
    return res.status(400).send('Invalid param <type>, please use one of: ranked, flexranked5v5, flexranked3v3, soloranked')
  }
  if (!summonerId) return res.status(400).send('Missing region')

  champions.getMostFrequentChampions({ region, type, summonerId, season })
    .then(champions => {
      return res.send(champions)
    })
    .catch((error) => {
      console.error(error)
    })
})


