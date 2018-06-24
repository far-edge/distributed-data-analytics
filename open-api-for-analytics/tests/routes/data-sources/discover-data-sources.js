const faker = require('faker');
const nock = require('nock');
const Promise = require('bluebird');

const app = require('../../../server');
const edgeGatewayHelper = require('../../helpers/edge-gateways');
const requests = require('../../requests');

// Tests the data source discovery.
const testDiscoverDataSources = () => {
  describe('POST @ /data-sources/discover', () => {
    it('should discover locally scoped data sources', () => {
      const dataRouterAndPreprocessorBaseUrl = faker.internet.url();
      const dataSourceDefinitionReferenceId = faker.random.uuid();
      nock(`${ dataRouterAndPreprocessorBaseUrl }`).post('/data-sources/discover', {
        dataSourceDefinitionReferenceID: dataSourceDefinitionReferenceId
      }).reply(200, {
        dataSources: [{ }]
      });
      const p = Promise.try(() => {
        return edgeGatewayHelper.createEdgeGateway({
          dataRouterAndPreprocessorBaseURL: dataRouterAndPreprocessorBaseUrl
        });
      }).then((edgeGateway) => {
        const data = {
          dataSourceDefinitionReferenceID: dataSourceDefinitionReferenceId
        };
        return requests.cpost(app, `/api/data-sources/discover?edgeGatewayReferenceID=${ edgeGateway._id }`, data);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 200),
        p.should.eventually.have.property('body').that.has.property(
          'dataSources'
        ).with.length(1)
      ]);
    });
  });
};

module.exports = testDiscoverDataSources;
