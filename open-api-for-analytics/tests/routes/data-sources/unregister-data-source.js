const faker = require('faker');
const nock = require('nock');
const Promise = require('bluebird');

const app = require('../../../server');
const dataSourceHelper = require('../../helpers/data-sources');
const edgeGatewayHelper = require('../../helpers/edge-gateways');
const requests = require('../../requests');

// Tests the data source unregistration.
const testUnregisterDataSource = () => {
  describe('DELETE @ /data-sources/:id', () => {
    it('should unregister a locally scoped data source', () => {
      const dataRouterAndPreprocessorBaseUrl = faker.internet.url();
      const dataSourceManifestId = faker.random.uuid();
      nock(`${ dataRouterAndPreprocessorBaseUrl }`).delete(`/data-sources/${ dataSourceManifestId }`).reply(204);
      const p = Promise.try(() => {
        return edgeGatewayHelper.createEdgeGateway({
          dataRouterAndPreprocessorBaseURL: dataRouterAndPreprocessorBaseUrl
        });
      }).then((edgeGateway) => {
        return requests.cdelete(app, `/api/data-sources/${ dataSourceManifestId }?edgeGatewayReferenceID=${ edgeGateway._id }`);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 204)
      ]);
    });

    it('should unregister a globally scoped data source', () => {
      const p = Promise.try(() => {
        return dataSourceHelper.registerDataSource();
      }).then((dataSourceManifest) => {
        return requests.cdelete(app, `/api/data-sources/${ dataSourceManifest._id }`);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 204)
      ]);
    });
  });
};

module.exports = testUnregisterDataSource;
