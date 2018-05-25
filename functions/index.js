const functions = require('firebase-functions');
const axios = require('axios')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const API_RIOT_KEY = 'RGAPI-639291ee-9f27-42bc-8ce6-249a0e3b956d'
const BASE_EUW = 'https://euw1.api.riotgames.com'

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.getSummonerInfo = functions.https.onRequest((req, res) => {
  // ---- Example answer for blaxtem ------
  // const exampleAnswer= {
  //   "id": 63749117,
  //   "accountId": 214623284,
  //   "name": "Blaxtem",
  //   "profileIconId": 3190,
  //   "revisionDate": 1527271451000,
  //   "summonerLevel": 87
  // }
  // Make a request for a user with a given ID

  if (!req.query.summoner) return res.status(400).send('Missing summoner name')
  if (!req.query.region) return res.status(400).send('Missing region')

  const summoner = req.query.summoner
  const url = `${BASE_EUW}/lol/summoner/v3/summoners/by-name/${summoner}?api_key=${API_RIOT_KEY}`
  axios.get(url)
    .then(({ data }) => {
      res.setHeader('Content-Type', 'application/json');
      return res.send(data)
    })
    .catch(error => {
      return res.send(error)
    });
})
