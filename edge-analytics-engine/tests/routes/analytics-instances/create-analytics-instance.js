const faker = require('faker');
const nock = require('nock');
const Promise = require('bluebird');

const app = require('../../../server');
const requests = require('../../requests');

// Tests the analytics instance creation.
const testCreateAnalyticsInstance = () => {
  describe('POST @ /analytics-instances', () => {
    it('should create an analytics instance', () => {
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
      const analyticsProcessorDefinitionId =
        data.analyticsProcessors.apm[0].analyticsProcessorDefinitionReferenceID;
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
      const dataSourceId =
        data.analyticsProcessors.apm[0].dataSources.dataSource[0].dataSourceManifestReferenceID;
      nock(`${ process.env.DATA_ROUTER_AND_PREPROCESSOR_BASE_URL }`)
        .post('/data-sources/discover', {
          id: dataSourceId
        }).reply(200, {
          dataSources: [
            {
              id: dataSourceId
            }
          ]
        });
      const dataSinkId = data.analyticsProcessors.apm[0].dataSink.dataSourceManifestReferenceID;
      nock(`${ process.env.DATA_ROUTER_AND_PREPROCESSOR_BASE_URL }`)
        .post('/data-sources/discover', {
          id: dataSinkId
        }).reply(200, {
          dataSources: [
            {
              id: dataSinkId
            }
          ]
        });
      const p = Promise.try(() => {
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
