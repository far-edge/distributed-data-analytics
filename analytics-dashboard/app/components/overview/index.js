import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, Container, Icon, Label } from 'semantic-ui-react';

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
    this.fetchEdgeGateways();
  }

  fetchEdgeGateways() {
    // eslint-disable-next-line no-console
    console.log('Fetch the edge gateways.');
    send({
      url: 'edge-gateways/discover',
      method: 'POST',
      data: { }
    }).then((response) => {
      const edgeGateways = response.data.edgeGateways;
      this.props.setEdgeGateways(edgeGateways);
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch the edge gateways.', error);
      messages.error(tr('FAILED_TO_FETCH_EDGE_GATEWAYS', error.message));
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
                <Label.Detail>0</Label.Detail>
              </Label>
              <Label>
                { tr('ANALYTICS_INSTANCES') }
                <Label.Detail>0</Label.Detail>
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
                      <Label.Detail>42</Label.Detail>
                    </Label>
                    <Label>
                      { tr('ANALYTICS_INSTANCES') }
                      <Label.Detail>42</Label.Detail>
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
    dataKinds: state.dataKinds.dataKinds,
    dataInterfaces: state.dataInterfaces.dataInterfaces,
    dataSourceDefinitions: state.dataSourceDefinitions.dataSourceDefinitions,
    edgeGateways: state.edgeGateways.edgeGateways
  };
};

const mapDispatchToProps = (dispatch) => {
  const _edgeGateways = bindActionCreators(edgeGateways, dispatch);
  return {
    setEdgeGateways: _edgeGateways.setEdgeGateways
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
