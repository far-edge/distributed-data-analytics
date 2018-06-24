const faker = require('faker');
const nock = require('nock');
const Promise = require('bluebird');

const app = require('../../../server');
const edgeGatewayHelper = require('../../helpers/edge-gateways');
const requests = require('../../requests');

// Tests the data source registration.
const testRegisterDataSource = () => {
  describe('POST @ /data-sources', () => {
    it('should register a locally scoped data source', () => {
      const dataRouterAndPreprocessorBaseUrl = faker.internet.url();
      nock(`${ dataRouterAndPreprocessorBaseUrl }`).post('/data-sources').reply(201, {
      });
      const p = Promise.try(() => {
        return edgeGatewayHelper.createEdgeGateway({
          dataRouterAndPreprocessorBaseURL: dataRouterAndPreprocessorBaseUrl
        });
      }).then((edgeGateway) => {
        const data = {
          ...{
            name: faker.random.words(2),
            macAddress: faker.internet.mac(),
            dataSourceDefinitionReferenceID: faker.random.uuid()
          },
          ...(faker.random.boolean() ? { description: faker.random.words(10) } : { }),
          ...(faker.random.boolean() ? {
            dataSourceDefinitionInterfaceParameters: {
              parameter: [
                {
                  key: faker.random.words(2),
                  value: faker.random.boolean() ? faker.random.words(2) :
                    faker.random.number(0, 100)
                }
              ]
            }
          } : { })
        };
        return requests.cpost(app, `/api/data-sources?edgeGatewayReferenceID=${ edgeGateway._id }`, data);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 201),
        p.should.eventually.have.property('body').that.is.an('object')
      ]);
    });

    it('should register a globally scoped data source', () => {
      const dataSourceDefinitionReferenceId = faker.random.uuid();
      nock(`${ process.env.MODEL_REPOSITORY_BASE_URL }`).post('/data-source-definitions/discover', {
        id: dataSourceDefinitionReferenceId
      }).reply(200, {
        dataSourceDefinitions: [
          {
            id: dataSourceDefinitionReferenceId
          }
        ]
      });
      const data = {
        ...{
          name: faker.random.words(2),
          macAddress: faker.internet.mac(),
          dataSourceDefinitionReferenceID: dataSourceDefinitionReferenceId
        },
        ...(faker.random.boolean() ? { description: faker.random.words(10) } : { }),
        ...(faker.random.boolean() ? {
          dataSourceDefinitionInterfaceParameters: {
            parameter: [
              {
                key: faker.random.words(2),
                value: faker.random.boolean() ? faker.random.words(2) : faker.random.number(0, 100)
              }
            ]
          }
        } : { })
      };
      const p = Promise.try(() => {
        return requests.cpost(app, '/api/data-sources', data);
      });
      return Promise.all([
        p.should.eventually.have.property('statusCode', 201),
        p.should.eventually.have.property('body').that.is.an('object')
      ]);
    });
  });
};

module.exports = testRegisterDataSource;
