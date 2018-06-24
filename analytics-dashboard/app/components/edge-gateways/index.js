import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Container, Message, Modal, Segment } from 'semantic-ui-react';

import edgeGateways from 'actions/edge-gateways';
import EdgeGatewayForm from 'components/edge-gateways/edge-gateway-form';
import EdgeGatewayTable from 'components/edge-gateways/edge-gateway-table';
import { clean } from 'helpers/chisels';
import { tr } from 'helpers/languages';
import messages from 'helpers/messages';
import { send } from 'helpers/requests';

class EdgeGateways extends Component {

  constructor(props) {
    super(props);
    this.state = {
      edgeGateway: {
        name: '',
        description: '',
        namespace: '',
        macAddress: '',
        location: {
          virtualLocation: ''
        },
        dataRouterAndPreprocessorBaseURL: '',
        edgeAnalyticsEngineBaseURL: '',
        additionalInformation: ''
      },
      modal: false
    };
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

  createEdgeGateway() {
    this.setState({
      edgeGateway: {
        name: '',
        description: '',
        namespace: '',
        macAddress: '',
        location: {
          virtualLocation: ''
        },
        dataRouterAndPreprocessorBaseURL: '',
        edgeAnalyticsEngineBaseURL: '',
        additionalInformation: ''
      },
      modal: true
    });
  }

  editEdgeGateway(edgeGateway) {
    this.setState({
      edgeGateway,
      modal: true
    });
  }

  saveEdgeGateway() {
    const edgeGateway = clean(this.state.edgeGateway);
    if (!edgeGateway.name) {
      messages.error(tr('GIVE_NAME'));
      return;
    }
    if (!edgeGateway.namespace) {
      messages.error(tr('GIVE_NAMESPACE'));
      return;
    }
    if (!edgeGateway.macAddress) {
      messages.error(tr('GIVE_MAC_ADDRESS'));
      return;
    }
    if (!edgeGateway.dataRouterAndPreprocessorBaseURL) {
      messages.error(tr('GIVE_DATA_ROUTER_AND_PREPROCESSOR_BASE_URL'));
      return;
    }
    if (!edgeGateway.edgeAnalyticsEngineBaseURL) {
      messages.error(tr('GIVE_EDGE_ANALYTICS_ENGINE_BASE_URL'));
      return;
    }
    // eslint-disable-next-line no-console
    console.log(edgeGateway.id ? 'Create an edge gateway.' : `Update the edge gateways ${ edgeGateway.id }.`);
    send({
      method: edgeGateway.id ? 'PUT' : 'POST',
      url: edgeGateway.id ? `/edge-gateways/${ edgeGateway.id }` : '/edge-gateways',
      data: {
        ...edgeGateway
      }
    }).then((_data) => {
      this.fetchEdgeGateways();
      this.hideModal();
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(edgeGateway.id ? `Failed to update the edge gateway ${ edgeGateway.id }.` :
        'Failed to create an edge gateway.', error);
      messages.error(tr('FAILED_TO_SAVE_EDGE_GATEWAY', error.message));
    });
  }

  deleteEdgeGateway(edgeGateway) {
    // eslint-disable-next-line no-console
    console.log(`Delete the edge gateway ${ edgeGateway.id }.`);
    send({
      method: 'DELETE',
      url: `/edge-gateways/${ edgeGateway.id }`
    }).then((_data) => {
      this.fetchEdgeGateways();
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(`Failed to delete the edge gateway ${ edgeGateway.id }.`, error);
      messages.error(tr('FAILED_TO_DELETE_EDGE_GATEWAY', error.message));
    });
  }

  changeValue(field, value) {
    const edgeGateway = { ...this.state.edgeGateway };
    if (field === 'additionalInformation') {
      edgeGateway.additionalInformation = [ value ];
    } else if (field === 'location') {
      edgeGateway.location = { virtualLocation: value };
    } else {
      edgeGateway[field] = value;
    }
    this.setState({ edgeGateway });
  }

  hideModal() {
    this.setState({ modal: false });
  }

  render() {
    // eslint-disable-next-line no-console
    console.log('Render the edge gateways.');
    return (
      <Container className='edge-gateways pretty-scroll'>
        {
          this.props.edgeGateways.length > 0 && (
            <EdgeGatewayTable
              edgeGateways={ this.props.edgeGateways }
              onEdit={
                (edgeGateway) => {
                  this.editEdgeGateway(edgeGateway);
                }
              }
              onDelete={
                (edgeGateway) => {
                  this.deleteEdgeGateway(edgeGateway);
                }
              }
            />
          )
        }
        {
          this.props.edgeGateways.length === 0 && (
            <Message>{ tr('NO_EDGE_GATEWAYS') }</Message>
          )
        }
        <Button
          className='add-edge-gateway'
          onClick={ (_e) => { this.createEdgeGateway(); } }
        >
          { tr('ADD') }
        </Button>
        <Modal
          open={ this.state.modal }
          onClose={ () => { this.hideModal(); } }
          size='small'
        >
          <Segment>
            <Segment className='edge-gateway-form'>
              <EdgeGatewayForm
                edgeGateway={ this.state.edgeGateway }
                onChangeValue={ (field, value) => { this.changeValue(field, value); } }
                onSave={ () => { this.saveEdgeGateway(); } }
                onCancel={ () => { this.hideModal(); } }
              />
            </Segment>
          </Segment>
        </Modal>
      </Container>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
    edgeGateways: state.edgeGateways.edgeGateways
  };
};

const mapDispatchToProps = (dispatch) => {
  const _edgeGateways = bindActionCreators(edgeGateways, dispatch);
  return {
    setEdgeGateways: _edgeGateways.setEdgeGateways
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EdgeGateways);

