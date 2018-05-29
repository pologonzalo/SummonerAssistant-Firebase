const functions = require('firebase-functions');
const _ = require('lodash')


// FUNCTIONS 
const champions = require('./lib/champions')
const summoners = require('./lib/summoners')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions


// DEV purposes
const SUMMONER_ID = 63749117 // blaxtem
// const SUMMONER_ID = 23472656 // Asier

exports.getSummonerInfoByName = functions.https.onCall(data => summoners.getSummonerInfoByName(data))

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

exports.getSummaryMostFrequentChampions = functions.https.onRequest((req, res) => champions.getSummaryMostFrequentChampions(req.query, res))