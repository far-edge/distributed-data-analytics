const faker = require('faker');
const nock = require('nock');
const Promise = require('bluebird');
const sinon = require('sinon');

const AIM = require('../../../core/workers/analytics-instance-manager');
const analyticsInstanceHelper = require('../../helpers/analytics-instances');
const app = require('../../../server');
const requests = require('../../requests');
const State = require('../../../core/models/state');

// Tests the analytics instance specification update.
const testUpdateAnalyticsInstanceSpecification = () => {
  describe('PUT @ /analytics-instances/:id', () => {
    before(() => {
      return Promise.try(() => {
        const stub = sinon.stub(AIM, 'getAnalyticsInstanceState');
        stub.returns(Promise.resolve(State.STOPPED));
        return null;
      });
    });
    after(() => {
      return Promise.try(() => {
        AIM.getAnalyticsInstanceState.restore();
        return null;
      });
    });
    it('should update an analytics instance', () => {
      const p = Promise.try(() => {
        return analyticsInstanceHelper.createAnalyticsInstance({});
      }).then((analyticsInstance) => {
        const data = {
          ...analyticsInstance,
          analyticsProcessors: {
            apm: [
              {
                ...analyticsInstance.analyticsProcessors.apm[0],
                ...{
                  analyticsProcessorDefinitionReferenceID: faker.random.uuid()
                }
              }
            ]
          }
        };
        const analyticsProcessorDefinitionID =
          data.analyticsProcessors.apm[0].analyticsProcessorDefinitionReferenceID;
        nock(`${ process.env.MODEL_REPOSITORY_BASE_URL }`)
          .post('/analytics-processor-definitions/discover', {
            id: analyticsProcessorDefinitionID
          }).reply(200, {
            analyticsProcessorDefinitions: [
              {
                id: analyticsProcessorDefinitionID
              }
            ]
          });
        const dataSourceID =
          data.analyticsProcessors.apm[0].dataSources.dataSource[0].dataSourceManifestReferenceID;
        nock(`${ process.env.DATA_ROUTER_AND_PREPROCESSOR_BASE_URL }`)
          .post('/data-sources/discover', {
            id: dataSourceID
          }).reply(200, {
            dataSources: [
              {
                id: dataSourceID
              }
            ]
          });
        const dataSinkID = data.analyticsProcessors.apm[0].dataSink.dataSourceManifestReferenceID;
        nock(`${ process.env.DATA_ROUTER_AND_PREPROCESSOR_BASE_URL }`)
          .post('/data-sources/discover', {
            id: dataSinkID
          }).reply(200, {
            dataSources: [
              {
                id: dataSinkID
              }
            ]
          });
        const id = analyticsInstance._id;
        return requests.cput(app, `/api/analytics-instances/${ id }/specification`, data);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 200),
        p.should.eventually.have.property('body').that.is.an('object')
      ]);
    });
  });
};

module.exports = testUpdateAnalyticsInstanceSpecification;
