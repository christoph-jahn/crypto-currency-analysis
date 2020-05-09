import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import CoinGecko from 'coingecko-api';
import CryptoCurrencyAnalyzer from './CryptoCurrencyAnalyzer';

chai.use(chaiAsPromised);
const { expect } = chai;

/**
 * @typedef {import('./CoinGeckoTypes').Coin} Coin
 */
describe('CryptoCurrencyAnalyzer', async () => {
  /** @type {Coin} */ const BITCOIN = { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' };
  /** @type {string} */ const CURRENCY = 'eur';

  const client = new CoinGecko();
  /** @type CryptoCurrencyAnalyzer */ let cryptoCurrencyAnalyzer;

  before(async () => {
    cryptoCurrencyAnalyzer = await CryptoCurrencyAnalyzer.build(client);
  });

  context('CoinCeckoClient', () => {
    it('should ping CoinGecko API', () => expect(client.ping()).to.be.eventually.fulfilled);

    it('should be CoinGecko V3', () => expect(client.ping()).to.have.eventually.nested.property('data.gecko_says')
      .which.matches(/.*V3.*/));

    it('should fetch list of coins', async () => {
      /** @type {import('./CoinGeckoTypes').CoinGeckoResponse} */
      const response = await client.coins.list();

      /** @type {Coin[]} */
      const list = response.data;
      expect(list).to.have.length.greaterThan(10, 'should have more than 10 items');

      return Promise.resolve();
    });

    it('should return correct timestamps for market chart range', async () => {
      /** @type number */ const from = 1569196800; // 23.9.2019
      /** @type number */ const to = 1588982400; // 9.5.2020

      /** @type {import('./CoinGeckoTypes').CoinGeckoResponse} */
      const response = await client.coins.fetchMarketChartRange(BITCOIN.id, { vs_currency: CURRENCY, from, to });
      expect(response).to.have.property('success').which.is.true;

      /** @type import('./CoinGeckoTypes').MarketChartRange */
      const marketChartRange = response.data;
      expect(marketChartRange).to.have.keys(['market_caps', 'prices', 'total_volumes']);

      const [firstMarketCaps] = marketChartRange.market_caps;
      expect(firstMarketCaps[0]).to.be.equal(from * 1000);

      const [lastMarektCaps] = marketChartRange.market_caps.slice(-1);
      expect(lastMarektCaps[0]).to.be.equal(to * 1000);

      return Promise.resolve();
    });
  });

  it('should fetch coins from coingecko #sanity', () => {
    const { coins } = cryptoCurrencyAnalyzer;
    expect(coins).not.to.be.undefined;
    expect(coins).to.have.length.greaterThan(10, 'should have more than 10 items');

    const [firstCoin] = coins;
    expect(firstCoin).to.have.keys(['id', 'symbol', 'name']);

    const bitcoin = coins.find((coin) => coin.name === BITCOIN.name);
    expect(bitcoin).to.be.not.undefined;
    expect(bitcoin).to.be.eql(BITCOIN);
  });

  it('should return id of Bitcoin #sanity', () => {
    expect(cryptoCurrencyAnalyzer.getCoinId(BITCOIN.name)).to.be.equal(BITCOIN.id);
  });

  it('should get crypto prices for specified date range #sanity', async () => {
    // new Date(date*1000)
    /** @type Date */ const start = new Date('2019-09-23T00:00:00Z'); // UTC
    /** @type Date */ const end = new Date('2020-05-09T00:00:00Z'); // UTC

    /** @type import('./CoinGeckoTypes').MarketChartRange */
    const marketChartRange = await cryptoCurrencyAnalyzer.fetchBitcoinPricesByDateRange(start, end);
    expect(marketChartRange).to.have.keys(['market_caps', 'prices', 'total_volumes']);

    const [firstMarketCaps] = marketChartRange.market_caps;
    expect(firstMarketCaps[0]).to.be.eql(start).and.not.be.eql(end);

    const [lastMarektCaps] = marketChartRange.market_caps.slice(-1);
    expect(lastMarektCaps[0]).to.be.eql(end).and.not.be.eql(start);

    return Promise.resolve();
  });
});
