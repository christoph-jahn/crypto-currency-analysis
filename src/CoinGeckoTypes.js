/**
 * Response of https://www.coingecko.com/api/documentations/v3#/coins/get_coins_list
 * @typedef {Object} Coin
 * @property {string} id, e.g. "bitcoin"
 * @property {string} symbol, e.g. "btc"
 * @property {string} name, e.g. "Bitcoin"
 */

/**
  * Coingecko Response
  * @typedef {Object} CoinGeckoResponse
  * @property {boolean} success
  * @property {string} message
  * @property {number} code
  * @property {object} data
  */

/**
 * UnixTimeStamp
 * @typedef {number} UnixTimeStamp
 */

/**
 * The pair [UnixTimeStamp: number, Value: number] assigns a timestamp to a value.
 * @typedef {[UnixTimeStamp, number]} TimeValuePair
 */

/**
 * The properties of MarketChartRange are arrays of type #TimeValuePair.
 * @typedef {Object} MarketChartRange
 * @property {TimeValuePair[]} market_caps - array of the pair [UnixTimeStamp, Value]
 * @property {TimeValuePair[]} prices - array of the pair [UnixTimeStamp, Value]
 * @property {TimeValuePair[]} total_volumes - array of the pair [UnixTimeStamp, Value]
 * @see TimeValuePair
 */

export default {};
