'use strict'
const cheerio = require('cheerio')
const axios = require('axios')
const _ = require('lodash')


/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

module.exports = {
  // GET
  getMostFrequentChampions, // 21 champs
  getSummaryMostFrequentChampions, // 7 champs
}

function getSummaryMostFrequentChampions({ summonerId, region, season, type }) {
  // url= euw.op.gg/summoner/champions/ajax/champions.most/summonerId=63749117&season=11&queueType=ranked
  return new Promise((resolve, reject) => {
    const path = `http://${region}.op.gg/summoner/champions/ajax/champions.most/`
    return axios.get(path, {
      params: {
        summonerId,
        season,
        queueType: type
      }
    }).then(({ data }) => {
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
      return resolve(champions)
    })
  })
}

function getMostFrequentChampions({ summonerId, region, season, type }) {
  // url= euw.op.gg/summoner/champions/ajax/champions.most/summonerId=63749117&season=11&queueType=ranked
  return new Promise((resolve, reject) => {
    const path = `http://${region}.op.gg/summoner/champions/ajax/champions.rank/`
    const auxPath = 'http://euw.op.gg/summoner/champions/ajax/champions.rank/summonerId=63749117&season=11&queueType=ranked'
    console.log('>>>>>', path)
    return axios.get(path, {
      params: {
        summonerId,
        season,
        queueType: type
      }
    }).then(({ data }) => {
      const $ = cheerio.load(data)
      return resolve(data)
      const champions = []
      $('.Row').each((j, championHtml) => {
        console.log('>>>>>', j)
        if (j === 0) return
        const $ = cheerio.load(championHtml)
        const champion = {}
        champion.name = _.trim($('.ChampionImage > a > div').text())
        champion.thumbnailUrl = `http://opgg-static.akamaized.net/images/lol/champion/${champion.name.replace(' ', '')}.png?image=w_45&v=1`
        console.log('>>>>>Kill', $('Kill').text())
        champion.KDA = {
          kill: $('.Kill').text(),
          death: $('.Death').text(),
          assist: $('.Assist').text(),
          average: $('.KDA .Cell').text().replace(':1', '')
        }
        champion.winrate = _.trim($('.WinRatio').text())

        const valueCells = $('.Value').text()
        console.log('>>>>>', valueCells)

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