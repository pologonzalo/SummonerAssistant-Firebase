const axios = require('../api/api_config')
const { API_RIOT } = require('../api/api_config')



/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

module.exports = {
  // GET
  getSummonerInfoByName
}

function getSummonerInfoByName({ region, summonerName }) {
  // if (!region) throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
  //   'one arguments "text" containing the message text to add.');
  // if (!summonerName) throw new functions.https.HttpsError('invalid-argument', 'Missing Summoner Name');
  const path = `https://${region}1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}`
  return axios.get(path, { params: { api_key: API_RIOT } })
    .then(({ data }) => {
      data.profileIconThumbnail = `https://opgg-static.akamaized.net/images/profile_icons/profileIcon${data.profileIconId}.jpg`
      return data
    })
}