
const functions = require('firebase-functions')
const axios = require('../api/api_config')
const { API_RIOT } = require('../api/api_config')
const cheerio = require('cheerio')
const _ = require('lodash')
const { stringToInt } = require('../helpers/utils')

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */



exports = module.exports = functions.https.onCall(({ region = 'euw', summonerId, type = 'ranked', season = 11 }) => {
  const path = `http://${region}.op.gg/summoner/champions/ajax/champions.rank/`
  return axios.get(path, {
    params: {
      summonerId,
      season,
      queueType: type
    }
  })
    .then(({ data }) => {
      const $ = cheerio.load(data)
      const champions = []
      $('.Row').each((j, championHtml) => {
        if (j === 0) return
        const $ = cheerio.load(championHtml)
        const champion = {}
        champion.name = _.trim($('.ChampionImage > a > div').text())
        champion.thumbnailUrl = `http://opgg-static.akamaized.net/images/lol/champion/${champion.name.replace(' ', '')}.png?image=w_45&v=1`

        // KDA
        const kills = stringToInt($('.Kill').text())
        const deaths = stringToInt(($('.Death').text()))
        const assists = stringToInt($('.Assist').text())
        const average = kills + assists / deaths
        champion.KDA = {
          kills,
          assists,
          deaths,
          average
        }

        // GAMES
        const wins = stringToInt((_.replace(_.trim($('.Text.Left').text()), 'V', '')))
        const losses = stringToInt((_.replace(_.trim($('.Text.Right').text()), 'L', '')))
        const winrate = stringToInt((_.replace(_.trim($('.WinRatio').text()), '%', '')))
        const played = wins + losses
        champion.games = {
          wins,
          losses,
          winrate,
          played
        }

        $('.Value').each((i, valueCell) => {
          const $ = cheerio.load(valueCell)
          switch (i) {
            case 0:
              champion.gold = stringToInt((_.replace(_.trim($('.Value').text()), ',', '')))
              break
            case 1:
              champion.cs = stringToInt(_.trim($('.Value').text()))
              break
            case 2:
              champion.maxKills = stringToInt(_.trim($('.Value').text()))
              break
            case 3:
              champion.maxDeaths = stringToInt((_.trim($('.Value').text())))
              break
            case 4:
              champion.averageDamageDealt = stringToInt(_.replace(_.trim($('.Value').text()), ',', ''))
              break
            case 5:
              champion.averageDamageTaken = stringToInt(_.replace(_.trim($('.Value').text()), ',', ''))
              break
            case 6:
              champion.doubleKill = stringToInt(_.trim($('.Value').text()))
              break
            case 7:
              champion.tripleKill = stringToInt(_.trim($('.Value').text()))
              break
            case 8:
              champion.quadraKill = stringToInt(_.trim($('.Value').text()))
              break
            case 9:
              champion.pentaKill = stringToInt(_.trim($('.Value').text()))
              break
            default:
              break
          }
        })
        champions.push(champion)
      })
      return champions

    }).catch(({ message }) => { throw new functions.https.HttpsError('internal', message) })
})


// exports = module.exports = functions.https.onRequest((req, res) => {
//   const { region, summonerId, type, season } = req.query
//   const path = `http://${region}.op.gg/summoner/champions/ajax/champions.rank/`
//   return axios.get(path, {
//     params: {
//       summonerId,
//       season,
//       queueType: type
//     }
//   })
//     .then(({ data }) => {
//       const $ = cheerio.load(data)
//       const champions = []
//       $('.Row').each((j, championHtml) => {
//         if (j === 0) return
//         if (j > 1) return
//         const $ = cheerio.load(championHtml)
//         const champion = {}
//         champion.name = _.trim($('.ChampionImage > a > div').text())
//         champion.thumbnailUrl = `http://opgg-static.akamaized.net/images/lol/champion/${champion.name.replace(' ', '')}.png?image=w_45&v=1`
//         champion.KDA = {
//           kill: parseInt($('.Kill').text()),
//           death: parseInt($('.Death').text()),
//           assist: parseInt($('.Assist').text()),
//           average: (parseInt($('.Kill').text()) + parseInt($('.Assist').text())) / parseInt($('.Death').text())
//         }
//         // champion.KDA.average = (champion.KDA.kill + champion.KDA.assist) / champion.KDA.death
//         champion.games = {
//           winrate: parseInt(_.replace(_.trim($('.WinRatio').text()), '%', '')),
//           wins: parseInt(_.replace(_.trim($('.Text.Left').text()), 'V', '')),
//           losses: parseInt(_.replace(_.trim($('.Text.Right').text()), 'L', '')),
//           played: parseInt(_.replace(_.trim($('.Text.Left').text()), 'V', '')) + parseInt(_.replace(_.trim($('.Text.Right').text()), 'L', ''))
//         }

//         $('.Value').each((i, valueCell) => {
//           const $ = cheerio.load(valueCell)
//           switch (i) {
//             case 0:
//               champion.gold = _.parseInt(_.replace(_.trim($('.Value').text()), ',', ''))
//               break
//             case 1:
//               champion.cs = _.isNaN(parseInt(_.trim($('.Value').text()))) ? 99999 : parseInt(_.trim($('.Value').text()))
//               break
//             case 2:
//               champion.maxKills = _.isNaN(parseInt(_.trim($('.Value').text()))) ? 99999 : parseInt(_.trim($('.Value').text()))
//               break
//             case 3:
//               champion.maxDeaths = _.isNaN(parseInt((_.trim($('.Value').text())))) ? 99999 : parseInt(_.trim($('.Value').text()))
//               break
//             case 4:
//               champion.averageDamageDealt = _.isNaN(parseInt(_.replace(_.trim($('.Value').text()), ',', ''))) ? 9999 : parseInt(_.replace(_.trim($('.Value').text()), ',', ''))
//               break
//             case 5:
//               champion.averageDamageTaken = _.isNaN(parseInt(_.replace(_.trim($('.Value').text()), ',', ''))) ? 9999 : parseInt(_.replace(_.trim($('.Value').text()), ',', ''))
//               break
//             case 6:
//               champion.doubleKill = _.isNaN(parseInt(_.trim($('.Value').text()))) ? 9999 : parseInt(_.trim($('.Value').text()))
//               break
//             case 7:
//               champion.tripleKill = _.isNaN(parseInt(_.trim($('.Value').text()))) ? 9999 : parseInt(_.trim($('.Value').text()))
//               break
//             case 8:
//               champion.quadraKill = _.isNaN(parseInt(_.trim($('.Value').text()))) ? 9999 : parseInt(_.trim($('.Value').text()))
//               break
//             case 9:
//               champion.pentaKill = _.isNaN(parseInt(_.trim($('.Value').text()))) ? 9999 : parseInt(_.trim($('.Value').text()))
//               break
//             default:
//               break
//           }
//         })
//         champions.push(champion)
//       })
//       return res.send(champions)

//     }).catch((err) => res.status(500).send(err))
// })

