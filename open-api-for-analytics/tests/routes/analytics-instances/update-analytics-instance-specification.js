const faker = require('faker');
const nock = require('nock');
const Promise = require('bluebird');
const sinon = require('sinon');

const AIM = require('../../../core/workers/analytics-instance-manager');
const analyticsInstanceHelper = require('../../helpers/analytics-instances');
const app = require('../../../server');
const edgeGatewayHelper = require('../../helpers/edge-gateways');
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
    it('should update a locally scoped analytics instance', () => {
      const edgeAnalyticsEngineBaseUrl = faker.internet.url();
      const analyticsManifestId = faker.random.uuid();
      nock(`${ edgeAnalyticsEngineBaseUrl }`).put(`/analytics-instances/${ analyticsManifestId }/specification`).reply(200, {
      });
      const p = Promise.try(() => {
        return edgeGatewayHelper.createEdgeGateway({
          edgeAnalyticsEngineBaseURL: edgeAnalyticsEngineBaseUrl
        });
      }).then((edgeGateway) => {
        const data = {
          ...{
            name: faker.random.words(2),
            analyticsProcessors: {
              apm: [
                {
                  ...{
                    name: faker.random.words(2),
                    analyticsProcessorDefinitionReferenceID: faker.random.uuid(),
                    dataSources: {
                      dataSource: [
                        {
                          dataSourceManifestReferenceID: faker.random.uuid()
                        }
                      ]
                    },
                    dataSink: {
                      dataSourceManifestReferenceID: faker.random.uuid()
                    }
                  },
                  ...(faker.random.boolean() ? { description: faker.random.words(10) } : { }),
                  ...(faker.random.boolean() ? {
                    parameters: {
                      parameter: [
                        {
                          key: faker.random.words(2),
                          value: faker.random.boolean() ? faker.random.words(2) :
                            faker.random.number(0, 100)
                        }
                      ]
                    }
                  } : { })
                }
              ]
            }
          },
          ...(faker.random.boolean() ? { description: faker.random.words(10) } : { })
        };
        return requests.cput(app, `/api/analytics-instances/${ analyticsManifestId }/specification?edgeGatewayReferenceID=${ edgeGateway._id }`, data);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 200),
        p.should.eventually.have.property('body').that.is.an('object')
      ]);
    });

    it('should update a globally scoped analytics instance', () => {
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
        const apdid = data.analyticsProcessors.apm[0].analyticsProcessorDefinitionReferenceID;
        nock(`${ process.env.MODEL_REPOSITORY_BASE_URL }`)
          .post('/analytics-processor-definitions/discover', {
            id: apdid
          }).reply(200, {
            analyticsProcessorDefinitions: [
              {
                id: apdid
              }
            ]
          });
        return requests.cput(app, `/api/analytics-instances/${ analyticsInstance._id }/specification`, data);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 200),
        p.should.eventually.have.property('body').that.is.an('object')
      ]);
    });
  });
};

module.exports = testUpdateAnalyticsInstanceSpecification;
