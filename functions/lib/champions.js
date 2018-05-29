const cheerio = require('cheerio')
const _ = require('lodash')
const axios = require('../api/api_config')
const {
  MISSING_REGION,
  MISSING_SUMMONER_ID,
  INVALID_PARAM_TYPE
} = require('./constants')


/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

module.exports = {
  // GET
  getMostFrequentChampions, // 21 champs
  getSummaryMostFrequentChampions, // 7 champs
}

function getSummaryMostFrequentChampions({ summonerId, region, season = 11, type = 'ranked' }, res) {
  /* ====================================================== */
  /*                        Params Validator                */
  /* ====================================================== */
  if (!region) return res.status(400).send(MISSING_REGION)
  if (!type || (type !== 'ranked' && type !== 'flexranked5v5' && type !== 'flexranked3v3' && type !== 'soloranked')) return res.status(400).send(INVALID_PARAM_TYPE)
  if (!summonerId) return res.status(400).send(MISSING_SUMMONER_ID)
  season = season ? 8 : season

  /* ====================================================== */
  /*                        Implementation                  */
  /* ====================================================== */
  // url= euw.op.gg/summoner/champions/ajax/champions.most/summonerId=63749117&season=11&queueType=ranked
  const path = `http://${region}.op.gg/summoner/champions/ajax/champions.most/`
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
      $('.ChampionBox').each((j, championHtml) => {
        const $ = cheerio.load(championHtml)
        const champion = {}
        champion.name = _.trim($('.ChampionName').text())
        champion.thumbnailUrl = `http://opgg-static.akamaized.net/images/lol/champion/${champion.name.replace(' ', '')}.png?image=w_45&v=1`
        const cs = $('.ChampionMinionKill').text().split(' ')
        champion.cs = {
          average: cs[1],
          perMin: _.trim(cs[2].replace('(', '').replace(')', ''))
        }
        champion.KDA = {
          kill: $('.Kill').text(),
          death: $('.Death').text(),
          assist: $('.Assist').text(),
          average: $('.KDA').text().replace(':1', '')
        }
        champion.winrate = _.trim($('.WinRatio').text())
        champion.gamesPlayed = $('.Title').text()

        champions.push(champion)
      })
      console.log('>>>>>Champ', champions)
      return res.send(champions)
    })
}

function getMostFrequentChampions({ summonerId, region, season, type }) {
  return new Promise((resolve, reject) => {
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
            kill: $('.Kill').text(),
            death: $('.Death').text(),
            assist: $('.Assist').text(),
            average: $('.KDA .Cell').text().replace(':1', '')
          }
          champion.winrate = _.trim($('.WinRatio').text())

          $('.Value').each((i, valueCell) => {
            const $ = cheerio.load(valueCell)
            switch (i) {
              case 0:
                champion.gold = _.trim($('.Value').text())
                break
              case 1:
                champion.cs = _.trim($('.Value').text())
                break
              case 2:
                champion.turrets = _.trim($('.Value').text())
                break
              case 3:
                champion.maxKills = _.trim($('.Value').text())
                break
              case 4:
                champion.maxDeaths = _.trim($('.Value').text())
                break
              case 5:
                champion.averageDamageDealt = _.trim($('.Value').text())
                break
              case 6:
                champion.averageDamageTaken = _.trim($('.Value').text())
                break
              case 7:
                champion.doubleKill = _.trim($('.Value').text())
                break
              case 8:
                champion.maxDeaths = _.trim($('.Value').text())
                break
              case 9:
                champion.averageDamageDealt = _.trim($('.Value').text())
                break
            }
          })

          // const cs = $('.ChampionMinionKill').text().split(' ')
          // champion.cs = {
          //   average: cs[1],
          //   perMin: _.trim(cs[2].replace('(', '').replace(')', ''))
          // }
          // champion.KDA = {
          //   kill: $('.Kill').text(),
          //   death: $('.Death').text(),
          //   assist: $('.Assist').text(),
          //   average: $('.KDA').text().replace(':1', '')
          // }
          // 
          // champion.gamesPlayed = $('.Title').text()

          champions.push(champion)
        })
        return resolve(champions)
      })
  })
}