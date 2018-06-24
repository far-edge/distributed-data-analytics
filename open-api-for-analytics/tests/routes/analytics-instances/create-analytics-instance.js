const faker = require('faker');
const nock = require('nock');
const Promise = require('bluebird');

const app = require('../../../server');
const dataSourceHelper = require('../../helpers/data-sources');
const edgeGatewayHelper = require('../../helpers/edge-gateways');
const requests = require('../../requests');

// Tests the analytics instance creation.
const testCreateAnalyticsInstance = () => {
  describe('POST @ /analytics-instances', () => {
    it('should create a locally scoped analytics instance', () => {
      const edgeAnalyticsEngineBaseUrl = faker.internet.url();
      nock(`${ edgeAnalyticsEngineBaseUrl }`).post('/analytics-instances').reply(201, {
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
        return requests.cpost(app, `/api/analytics-instances?edgeGatewayReferenceID=${ edgeGateway._id }`, data);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 201),
        p.should.eventually.have.property('body').that.is.an('object')
      ]);
    });

    it('should register a globally scoped analytics instance', () => {
      const analyticsProcessorDefinitionId = faker.random.uuid();
      nock(`${ process.env.MODEL_REPOSITORY_BASE_URL }`)
        .post('/analytics-processor-definitions/discover', {
          id: analyticsProcessorDefinitionId
        }).reply(200, {
          analyticsProcessorDefinitions: [
            {
              id: analyticsProcessorDefinitionId
            }
          ]
        });
      const p = Promise.all([
        dataSourceHelper.registerDataSource({}),
        dataSourceHelper.registerDataSource({})
      ]).spread((dataSource, dataSink) => {
        const data = {
          ...{
            name: faker.random.words(2),
            analyticsProcessors: {
              apm: [
                {
                  ...{
                    name: faker.random.words(2),
                    analyticsProcessorDefinitionReferenceID: analyticsProcessorDefinitionId,
                    dataSources: {
                      dataSource: [
                        {
                          dataSourceManifestReferenceID: dataSource._id
                        }
                      ]
                    },
                    dataSink: {
                      dataSourceManifestReferenceID: dataSink._id
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
        return requests.cpost(app, '/api/analytics-instances', data);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 201),
        p.should.eventually.have.property('body').that.is.an('object')
      ]);
    });
  });
};

module.exports = testCreateAnalyticsInstance;
