const axios = require('axios')

/* ====================================================== */
/*                   Implementation                       */
/* ====================================================== */

const apiClient = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'text/html',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6'
  }
})

const API_RIOT = 'RGAPI-6c1a1417-038a-4a9e-911d-7d2b84f8f135'
/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

module.exports = {
  // GET
  get,
  post,
  API_RIOT
}

/* ====================================================== */
/*                         Users                          */
/* ====================================================== */

function get(path, axiosConfig) {
  return apiClient.get(path, axiosConfig).then(_parseResponse)
}

function post(path, data, axiosConfig) {
  return apiClient.post(path, data, axiosConfig).then(_parseResponse)
}

function put(path, data, axiosConfig) {
  return apiClient.put(path, data, axiosConfig).then(_parseResponse)
}

function remove(path, axiosConfig) {
  return apiClient.delete(path, axiosConfig).then(_parseResponse)
}

function _parseResponse({ data, headers, status, statusText }) {
  return { data, headers, status, statusText }
}
