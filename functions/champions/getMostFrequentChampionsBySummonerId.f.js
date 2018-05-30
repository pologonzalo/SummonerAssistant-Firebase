
const functions = require('firebase-functions')
const axios = require('../api/api_config')
const { API_RIOT } = require('../api/api_config')
const cheerio = require('cheerio')
const _ = require('lodash')

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

exports = module.exports = functions.https.onCall(({ region, summonerId, type, season }) => {
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
        champion.KDA = {
          kill: parseInt($('.Kill').text()),
          death: parseInt($('.Death').text()),
          assist: parseInt($('.Assist').text()),
        }
        champion.KDA.average = (champion.KDA.kill + champion.KDA.assist) / champion.KDA.death
        champion.winrate = parseInt(_.replace(_.trim($('.WinRatio').text()), '%', ''))

        $('.Value').each((i, valueCell) => {
          const $ = cheerio.load(valueCell)
          switch (i) {
            case 0:
              champion.gold = _.parseInt(_.replace(_.trim($('.Value').text()), ',', ''))
              break
            case 1:
              champion.cs = parseInt(_.trim($('.Value').text()))
              break
            case 2:
              champion.maxKills = parseInt(_.trim($('.Value').text()))
              break
            case 3:
              champion.maxDeaths = parseInt((_.trim($('.Value').text())))
              break
            case 4:
              champion.averageDamageDealt = parseInt(_.replace(_.trim($('.Value').text()), ',', ''))
              break
            case 5:
              champion.averageDamageTaken = parseInt(_.replace(_.trim($('.Value').text()), ',', ''))
              break
            case 6:
              champion.doubleKill = _.isNaN(parseInt(_.trim($('.Value').text()))) ? 0 : parseInt(_.trim($('.Value').text()))
              break
            case 7:
              champion.tripleKill = _.isNaN(parseInt(_.trim($('.Value').text()))) ? 0 : parseInt(_.trim($('.Value').text()))
              break
            case 8:
              champion.quadraKill = _.isNaN(parseInt(_.trim($('.Value').text()))) ? 0 : parseInt(_.trim($('.Value').text()))
              break
            case 9:
              champion.pentaKill = _.isNaN(parseInt(_.trim($('.Value').text()))) ? 0 : parseInt(_.trim($('.Value').text()))
              break
            default:
              break
          }
        })
        champions.push(champion)
      })
      return champions

    }).catch((err) => console.log(err))
})

