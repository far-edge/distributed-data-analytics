import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, Container, Icon, Label } from 'semantic-ui-react';

import analyticsInstances from 'actions/analytics-instances';
import analyticsProcessorDefinitions from 'actions/analytics-processor-definitions';
import dataInterfaces from 'actions/data-interfaces';
import dataKinds from 'actions/data-kinds';
import dataSourceDefinitions from 'actions/data-source-definitions';
import dataSources from 'actions/data-sources';
import edgeGateways from 'actions/edge-gateways';
import { tr } from 'helpers/languages';
import messages from 'helpers/messages';
import { send } from 'helpers/requests';

class Overview extends Component {

  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.fetchAnalyticsInstances();
    this.fetchAnalyticsProcessorDefinitions();
    this.fetchDataInterfaces();
    this.fetchDataKinds();
    this.fetchDataSourceDefinitions();
    this.fetchDataSources();
    this.fetchEdgeGateways();
  }

  fetchAnalyticsInstances() {
    // eslint-disable-next-line no-console
    console.log('Fetch the analytics instances.');
    send({
      url: `${ process.env.OPEN_API_FOR_ANALYTICS_BASE_URL }/analytics-instances/discover`,
      method: 'POST',
      data: { }
    }).then((response) => {
      const analyticsInstances = response.data.analyticsInstances;
      this.props.setAnalyticsInstances(analyticsInstances);
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch the analytics instances.', error);
      messages.error(`${ tr('FAILED_TO_FETCH_ANALYTICS_INSTANCES') } ${ tr(error.message) }`);
    });
  }

  fetchAnalyticsProcessorDefinitions() {
    // eslint-disable-next-line no-console
    console.log('Fetch the analytics processor definitions.');
    send({
      url: `${ process.env.MODEL_REPOSITORY_BASE_URL }/analytics-processor-definitions/discover`,
      method: 'POST',
      data: { }
    }).then((response) => {
      const analyticsProcessorDefinitions = response.data.analyticsProcessorDefinitions;
      this.props.setAnalyticsProcessorDefinitions(analyticsProcessorDefinitions);
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch the analytics processor definitions.', error);
      messages.error(`${ tr('FAILED_TO_FETCH_ANALYTICS_PROCESSOR_DEFINITIONS') } ${ tr(error.message) }`);
    });
  }

  fetchDataInterfaces() {
    // eslint-disable-next-line no-console
    console.log('Fetch the data interfaces.');
    send({
      url: `${ process.env.MODEL_REPOSITORY_BASE_URL }/data-interfaces/discover`,
      method: 'POST',
      data: { }
    }).then((response) => {
      const dataInterfaces = response.data.dataInterfaces;
      this.props.setDataInterfaces(dataInterfaces);
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch the data interfaces.', error);
      messages.error(`${ tr('FAILED_TO_FETCH_DATA_INTERFACES') } ${ tr(error.message) }`);
    });
  }

  fetchDataKinds() {
    // eslint-disable-next-line no-console
    console.log('Fetch the data kinds.');
    send({
      url: `${ process.env.MODEL_REPOSITORY_BASE_URL }/data-kinds/discover`,
      method: 'POST',
      data: { }
    }).then((response) => {
      const dataKinds = response.data.dataKinds;
      this.props.setDataKinds(dataKinds);
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch the data kinds.', error);
      messages.error(`${ tr('FAILED_TO_FETCH_DATA_KINDS') } ${ tr(error.message) }`);
    });
  }

  fetchDataSourceDefinitions() {
    // eslint-disable-next-line no-console
    console.log('Fetch the data source definitions.');
    send({
      url: `${ process.env.MODEL_REPOSITORY_BASE_URL }/data-source-definitions/discover`,
      method: 'POST',
      data: { }
    }).then((response) => {
      const dataSourceDefinitions = response.data.dataSourceDefinitions;
      this.props.setDataSourceDefinitions(dataSourceDefinitions);
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch the data source definitions.', error);
      messages.error(`${ tr('FAILED_TO_FETCH_DATA_SOURCE_DEFINITIONS') } ${ tr(error.message) }`);
    });
  }

  fetchDataSources() {
    // eslint-disable-next-line no-console
    console.log('Fetch the data sources.');
    send({
      url: `${ process.env.OPEN_API_FOR_ANALYTICS_BASE_URL }/data-sources/discover`,
      method: 'POST',
      data: { }
    }).then((response) => {
      const dataSources = response.data.dataSources;
      this.props.setDataSources(dataSources);
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch the data sources.', error);
      messages.error(`${ tr('FAILED_TO_FETCH_DATA_SOURCES') } ${ tr(error.message) }`);
    });
  }

  fetchEdgeGateways() {
    // eslint-disable-next-line no-console
    console.log('Fetch the edge gateways.');
    send({
      url: '/edge-gateways/discover',
      method: 'POST',
      data: { }
    }).then((response) => {
      const edgeGateways = response.data.edgeGateways;
      this.props.setEdgeGateways(edgeGateways);
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch the edge gateways.', error);
      messages.error(`${ tr('FAILED_TO_FETCH_EDGE_GATEWAYS') } ${ tr(error.message) }`);
    });
  }

  render() {
    // eslint-disable-next-line no-console
    console.log('Render the overview.');
    return (
      <Container className='overview pretty-scroll'>
        <Card.Group itemsPerRow={ 2 }>
          <Card key='cloud'>
            <Card.Content>
              <Card.Header>
                <Icon name='cloud' />
              </Card.Header>
            </Card.Content>
            <Card.Content extra className='statistics'>
              <Label>
                { tr('EDGE_GATEWAYS') }
                <Label.Detail>{ this.props.edgeGateways.length }</Label.Detail>
              </Label>
              <Label>
                { tr('DATA_KINDS') }
                <Label.Detail>{ this.props.dataKinds.length }</Label.Detail>
              </Label>
              <Label>
                { tr('DATA_INTERFACES') }
                <Label.Detail>{ this.props.dataInterfaces.length }</Label.Detail>
              </Label>
              <Label>
                { tr('DATA_SOURCE_DEFINITIONS') }
                <Label.Detail>{ this.props.dataSourceDefinitions.length }</Label.Detail>
              </Label>
              <Label>
                { tr('ANALYTICS_PROCESSOR_DEFINITIONS') }
                <Label.Detail>{ this.props.analyticsProcessorDefinitions.length }</Label.Detail>
              </Label>
              <Label>
                { tr('DATA_SOURCES') }
                <Label.Detail>{ this.props.dataSources.length }</Label.Detail>
              </Label>
              <Label>
                { tr('ANALYTICS_INSTANCES') }
                <Label.Detail>{ this.props.analyticsInstances.length }</Label.Detail>
              </Label>
            </Card.Content>
          </Card>
        </Card.Group>
        <Card.Group itemsPerRow={ 2 }>
          {
            this.props.edgeGateways.map((edgeGateway) => {
              return (
                <Card key={ `edge-gateway-${ edgeGateway.id }` }>
                  <Card.Content header={ edgeGateway.name } />
                  <Card.Content description={ edgeGateway.description } />
                  <Card.Content extra className='urls'>
                    <Label>
                      <Icon name='random' />
                      { edgeGateway.dataRouterAndPreprocessorBaseURL }
                    </Label>
                    <Label>
                      <Icon name='chart line' />
                      { edgeGateway.edgeAnalyticsEngineBaseURL }
                    </Label>
                  </Card.Content>
                  <Card.Content extra className='statistics'>
                    <Label>
                      { tr('DATA_SOURCES') }
                      <Label.Detail>
                        {
                          this.props.dataSources.filter((ds) => {
                            return ds.edgeGatewayReferenceID === edgeGateway.id;
                          }).length
                        }
                      </Label.Detail>
                    </Label>
                    <Label>
                      { tr('ANALYTICS_INSTANCES') }
                      <Label.Detail>
                        {
                          this.props.analyticsInstances.filter((ai) => {
                            return ai.edgeGatewayReferenceID === edgeGateway.id;
                          }).length
                        }
                      </Label.Detail>
                    </Label>
                  </Card.Content>
                </Card>
              );
            })
          }
        </Card.Group>
      </Container>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
    analyticsProcessorDefinitions: state.analyticsProcessorDefinitions.analyticsProcessorDefinitions,
    analyticsInstances: state.analyticsInstances.analyticsInstances,
    dataKinds: state.dataKinds.dataKinds,
    dataInterfaces: state.dataInterfaces.dataInterfaces,
    dataSourceDefinitions: state.dataSourceDefinitions.dataSourceDefinitions,
    dataSources: state.dataSources.dataSources,
    edgeGateways: state.edgeGateways.edgeGateways
  };
};

const mapDispatchToProps = (dispatch) => {
  const _analyticsInstances = bindActionCreators(analyticsInstances, dispatch);
  const _analyticsProcessorDefinitions = bindActionCreators(analyticsProcessorDefinitions, dispatch);
  const _dataInterfaces = bindActionCreators(dataInterfaces, dispatch);
  const _dataKinds = bindActionCreators(dataKinds, dispatch);
  const _dataSourceDefinitions = bindActionCreators(dataSourceDefinitions, dispatch);
  const _dataSources = bindActionCreators(dataSources, dispatch);
  const _edgeGateways = bindActionCreators(edgeGateways, dispatch);
  return {
    setAnalyticsInstances: _analyticsInstances.setAnalyticsInstances,
    setAnalyticsProcessorDefinitions: _analyticsProcessorDefinitions.setAnalyticsProcessorDefinitions,
    setDataInterfaces: _dataInterfaces.setDataInterfaces,
    setDataKinds: _dataKinds.setDataKinds,
    setDataSourceDefinitions: _dataSourceDefinitions.setDataSourceDefinitions,
    setDataSources: _dataSources.setDataSources,
    setEdgeGateways: _edgeGateways.setEdgeGateways
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
