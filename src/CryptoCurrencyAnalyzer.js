import CoinGecko from 'coingecko-api';

/**
 * @typedef {import('./CoinGeckoTypes').Coin} Coin
 */
export default class CryptoCurrencyAnalyzer {
  static async build(coinGeckoClient) {
    const instance = new CryptoCurrencyAnalyzer(coinGeckoClient);
    await instance.init();
    return instance;
  }

  /**
   * @private
   */
  constructor(coinGeckoClient = new CoinGecko()) {
    this.client = coinGeckoClient;
    this.currency = 'eur';
  }

  /**
   * @private
   */
  async init() {
    /** @type {import('./CoinGeckoTypes').CoinGeckoResponse} */
    const response = await this.client.coins.list();

    /** @type {Coin[]} */
    this.coins = response.data;
  }

  /**
   *
   * @param {Date} start
   * @param {Date} end
   * @return {Promise<import('./CoinGeckoTypes').MarketChartRange>}
   */
  async fetchBitcoinPricesByDateRange(start, end) {
    const toUnixTimeStamp = (date) => parseInt((date / 1000).toFixed(0), 10);
    const toDate = (unixTimeStamp) => new Date(unixTimeStamp);
    const arraysToDate = (pairs) => pairs.map(
      ([timestamp, value]) => [toDate(timestamp), value],
    );

    const bitcoinId = this.getCoinId('Bitcoin');
    const params = {
      vs_currency: this.currency,
      from: toUnixTimeStamp(start),
      to: toUnixTimeStamp(end),
    };

    /** @type {import('./CoinGeckoTypes').CoinGeckoResponse} */
    const response = await this.client.coins.fetchMarketChartRange(bitcoinId, params);

    /** @type import('./CoinGeckoTypes').MarketChartRange */
    const marketChartRange = response.data;

    return {
      market_caps: arraysToDate(marketChartRange.market_caps),
      prices: arraysToDate(marketChartRange.prices),
      total_volumes: arraysToDate(marketChartRange.total_volumes),
    };
  }

  /**
   * @public
   * @param {string} name
   * @return {string|null}
   */
  getCoinId(name) {
    /** @type {Coin} */
    const coinObject = this.coins.find((coin) => name.match(coin.name));
    return coinObject ? coinObject.id : null;
  }
}
