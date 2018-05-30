const functions = require('firebase-functions')
const axios = require('../api/api_config')
const { API_RIOT } = require('../api/api_config')

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

exports = module.exports = functions.https.onCall(({ region, summonerName }) => {
  const path = `https://${region}1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}`
  return axios.get(path, { params: { api_key: API_RIOT } })
    .then(({ data }) => {
      data.profileIconThumbnail = `https://opgg-static.akamaized.net/images/profile_icons/profileIcon${data.profileIconId}.jpg`
      return data
    })
})

