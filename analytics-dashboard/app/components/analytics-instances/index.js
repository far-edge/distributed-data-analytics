import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Container, Message, Modal, Segment } from 'semantic-ui-react';

import analyticsInstances from 'actions/analytics-instances';
import analyticsProcessorDefinitions from 'actions/analytics-processor-definitions';
import dataSources from 'actions/data-sources';
import edgeGateways from 'actions/edge-gateways';
import AnalyticsInstanceForm from 'components/analytics-instances/analytics-instance-form';
import AnalyticsInstanceTable from 'components/analytics-instances/analytics-instance-table';
import { clean, first } from 'helpers/chisels';
import { tr } from 'helpers/languages';
import messages from 'helpers/messages';
import { send } from 'helpers/requests';

class AnalyticsInstances extends Component {

  constructor(props) {
    super(props);
    this.state = {
      analyticsInstance: {
        edgeGatewayReferenceID: '',
        name: '',
        description: '',
        analyticsProcessors: {
          apm: [
            {
              name: '',
              description: '',
              analyticsProcessorDefinitionReferenceID: '',
              dataSink: {
                dataSourceManifestReferenceID: ''
              },
              dataSources: {
                dataSource: [
                ]
              },
              parameters: {
                parameter: [ ]
              }
            }
          ]
        }
      },
      modal: false
    };
    autoBind(this);
  }

  componentDidMount() {
    this.fetchAnalyticsInstances();
    this.fetchAnalyticsProcessorDefinitions();
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
      url: `${ process.env.OPEN_API_FOR_ANALYTICS_BASE_URL }/edge-gateways/discover`,
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

  addAnalyticsProcessor() {
    const analyticsProcessors = this.state.analyticsInstance.analyticsProcessors;
    this.setState({
      analyticsInstance: {
        ...this.state.analyticsInstance,
        analyticsProcessors: {
          apm: analyticsProcessors.apm.concat([{
            name: '',
            description: '',
            analyticsProcessorDefinitionReferenceID: '',
            dataSink: {
              dataSourceManifestReferenceID: ''
            },
            dataSources: {
              dataSource: [
              ]
            },
            parameters: {
              parameter: [ ]
            }
          }])
        }
      }
    });
  }

  deleteAnalyticsProcessor(i) {
    const analyticsInstance = this.state.analyticsInstance;
    analyticsInstance.analyticsProcessors.apm.splice(i, 1);
    setTimeout(() => {
      this.setState({ analyticsInstance });
    }, 0);
  }

  createAnalyticsInstance() {
    this.setState({
      analyticsInstance: {
        edgeGatewayReferenceID: '',
        name: '',
        description: '',
        analyticsProcessors: {
          apm: [
            {
              name: '',
              description: '',
              analyticsProcessorDefinitionReferenceID: '',
              dataSink: {
                dataSourceManifestReferenceID: ''
              },
              dataSources: {
                dataSource: [
                ]
              },
              parameters: {
                parameter: [ ]
              }
            }
          ]
        }
      },
      modal: true
    });
  }

  editAnalyticsInstance(analyticsInstance) {
    this.setState({
      analyticsInstance: {
        ...analyticsInstance.specification,
        id: analyticsInstance.id,
        edgeGatewayReferenceID: analyticsInstance.edgeGatewayReferenceID
      },
      modal: true
    });
  }

  saveAnalyticsInstance() {
    const analyticsInstance = clean(this.state.analyticsInstance);
    if (!analyticsInstance.name) {
      messages.error(tr('GIVE_NAME'));
      return;
    }
    if (!analyticsInstance.analyticsProcessors || !analyticsInstance.analyticsProcessors.apm ||
      !analyticsInstance.analyticsProcessors.apm.length) {
      messages.error(tr('DEFINE_ANALYTICS_PROCESSORS'));
      return;
    }
    if (analyticsInstance.analyticsProcessors.apm.some((apm) => {
      return !apm.analyticsProcessorDefinitionReferenceID;
    })) {
      messages.error(tr('SELECT_ANALYTICS_PROCESSOR_DEFINITION'));
      return;
    }
    if (analyticsInstance.analyticsProcessors.apm.some((apm) => {
      return !apm.dataSink;
    })) {
      messages.error(tr('SELECT_DATA_SINK'));
      return;
    }
    if (analyticsInstance.analyticsProcessors.apm.some((apm) => {
      return !apm.dataSources || !apm.dataSources.dataSource || !apm.dataSources.dataSource.length;
    })) {
      messages.error(tr('SELECT_DATA_SOURCES'));
      return;
    }

    const data = {
      ...analyticsInstance
    };
    analyticsInstance.analyticsProcessors.apm.forEach((apm) => {
      const filled = apm.parameters && apm.parameters.parameter ? apm.parameters.parameter.filter((p) => {
        return !!p.value;
      }) : [];
      if (filled.length) {
        apm.parameters.parameter = filled;
      } else {
        delete apm.parameters;
      }
    });

    // eslint-disable-next-line no-console
    console.log(analyticsInstance.id ? 'Create an analytics instance.' : `Update the analytics instance ${ analyticsInstance.id }.`);
    const query = analyticsInstance.edgeGatewayReferenceID ? `?edgeGatewayReferenceID=${ analyticsInstance.edgeGatewayReferenceID }` : '';
    send({
      method: analyticsInstance.id ? 'PUT' : 'POST',
      url: analyticsInstance.id ? `${ process.env.OPEN_API_FOR_ANALYTICS_BASE_URL }/analytics-instances/${ analyticsInstance.id }/specification${ query }` :
        `${ process.env.OPEN_API_FOR_ANALYTICS_BASE_URL }/analytics-instances${ query }`,
      data
    }).then((_data) => {
      this.fetchAnalyticsInstances();
      this.hideModal();
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(analyticsInstance.id ? `Failed to update the analytics instance ${ analyticsInstance.id }.` :
        'Failed to create an analytics instance.', error);
      messages.error(`${ tr('FAILED_TO_SAVE_ANALYTICS_INSTANCE') } ${ tr(error.message) }`);
    });
  }

  deleteAnalyticsInstance(analyticsInstance) {
    // eslint-disable-next-line no-console
    console.log(`Delete the analytics instance ${ analyticsInstance.id }.`);
    send({
      method: 'DELETE',
      url: analyticsInstance.edgeGatewayReferenceID ?
        `${ process.env.OPEN_API_FOR_ANALYTICS_BASE_URL }/analytics-instances/${ analyticsInstance.id }?edgeGatewayReferenceID=${ analyticsInstance.edgeGatewayReferenceID }` :
        `${ process.env.OPEN_API_FOR_ANALYTICS_BASE_URL }/analytics-instances/${ analyticsInstance.id }`
    }).then((_data) => {
      this.fetchAnalyticsInstances();
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(`Failed to delete the analytics instance ${ analyticsInstance.id }.`, error);
      messages.error(`${ tr('FAILED_TO_DELETE_ANALYTICS_INSTANCE') } ${ tr(error.message) }`);
    });
  }

  startAnalyticsInstance(analyticsInstance) {
    // eslint-disable-next-line no-console
    console.log(`Start the analytics instance ${ analyticsInstance.id }.`);
    send({
      method: 'POST',
      url: analyticsInstance.edgeGatewayReferenceID ?
        `${ process.env.OPEN_API_FOR_ANALYTICS_BASE_URL }/analytics-instances/${ analyticsInstance.id }/start?edgeGatewayReferenceID=${ analyticsInstance.edgeGatewayReferenceID }` :
        `${ process.env.OPEN_API_FOR_ANALYTICS_BASE_URL }/analytics-instances/${ analyticsInstance.id }/start`
    }).then((_data) => {
      this.fetchAnalyticsInstances();
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(`Failed to start the analytics instance ${ analyticsInstance.id }.`, error);
      messages.error(`${ tr('FAILED_TO_START_ANALYTICS_INSTANCE') } ${ tr(error.message) }`);
    });
  }

  stopAnalyticsInstance(analyticsInstance) {
    // eslint-disable-next-line no-console
    console.log(`Stop the analytics instance ${ analyticsInstance.id }.`);
    send({
      method: 'POST',
      url: analyticsInstance.edgeGatewayReferenceID ?
        `${ process.env.OPEN_API_FOR_ANALYTICS_BASE_URL }/analytics-instances/${ analyticsInstance.id }/stop?edgeGatewayReferenceID=${ analyticsInstance.edgeGatewayReferenceID }` :
        `${ process.env.OPEN_API_FOR_ANALYTICS_BASE_URL }/analytics-instances/${ analyticsInstance.id }/stop`
    }).then((_data) => {
      this.fetchAnalyticsInstances();
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(`Failed to stop the analytics instance ${ analyticsInstance.id }.`, error);
      messages.error(`${ tr('FAILED_TO_STOP_ANALYTICS_INSTANCE') } ${ tr(error.message) }`);
    });
  }

  changeValue(field, value) {
    const analyticsInstance = { ...this.state.analyticsInstance };
    analyticsInstance[field] = value;
    this.setState({ analyticsInstance });
  }

  changeAnalyticsProcessorValue(i, field, value) {
    const analyticsInstance = { ...this.state.analyticsInstance };
    if (field === 'analyticsProcessorDefinitionReferenceID' &&
      value !== analyticsInstance.analyticsProcessors.apm[i].analyticsProcessorDefinitionReferenceID) {
      const parameters = first(this.props.analyticsProcessorDefinitions.filter((apd) => {
        return apd.id === value;
      }).map((apd) => {
        return apd.parameters && apd.parameters.parameter ? apd.parameters.parameter : [];
      }));
      analyticsInstance.analyticsProcessors.apm[i].parameters.parameter = parameters.map((p) => {
        return { key: p.name, value: p.defaultValue || '' };
      });
    }
    if (field === 'dataSources') {
      analyticsInstance.analyticsProcessors.apm[i].dataSources.dataSource = value.map((id) => {
        return { dataSourceManifestReferenceID: id };
      });
    } else if (field === 'dataSink') {
      analyticsInstance.analyticsProcessors.apm[i].dataSink.dataSourceManifestReferenceID = value;
    } else {
      analyticsInstance.analyticsProcessors.apm[i][field] = value;
    }
    this.setState({ analyticsInstance });
  }

  changeAnalyticsProcessorParameterValue(i, name, value) {
    const analyticsInstance = { ...this.state.analyticsInstance };
    analyticsInstance.analyticsProcessors.apm[i].parameters.parameter =
      analyticsInstance.analyticsProcessors.apm[i].parameters.parameter.map((p) => {
        return p.key === name ? { key: p.key, value } : p;
      });
    this.setState({ analyticsInstance });
  }

  hideModal() {
    this.setState({ modal: false });
  }

  render() {
    // eslint-disable-next-line no-console
    console.log('Render the analytics instances.');
    return (
      <Container className='analytics-instances pretty-scroll'>
        {
          this.props.analyticsInstances.length > 0 && (
            <AnalyticsInstanceTable
              edgeGateways={ this.props.edgeGateways }
              analyticsInstances={ this.props.analyticsInstances }
              onEdit={ (analyticsInstance) => { this.editAnalyticsInstance(analyticsInstance); } }
              onDelete={ (analyticsInstance) => { this.deleteAnalyticsInstance(analyticsInstance); } }
              onStart={ (analyticsInstance) => { this.startAnalyticsInstance(analyticsInstance); } }
              onStop={ (analyticsInstance) => { this.stopAnalyticsInstance(analyticsInstance); } }
            />
          )
        }
        {
          this.props.analyticsInstances.length === 0 && (
            <Message>{ tr('NO_ANALYTICS_INSTANCES') }</Message>
          )
        }
        <Button
          className='add-analytics-instance'
          onClick={ (_e) => { this.createAnalyticsInstance(); } }
        >
          { tr('ADD') }
        </Button>
        <Modal
          open={ this.state.modal }
          closeOnDimmerClick
          closeOnDocumentClick
          closeOnEscape
          onClose={ () => { this.hideModal(); } }
          size='small'
        >
          <Segment>
            <Segment className='analytics-instance-form'>
              <AnalyticsInstanceForm
                analyticsProcessorDefinitions={ this.props.analyticsProcessorDefinitions }
                dataSources={ this.props.dataSources }
                edgeGateways={ this.props.edgeGateways }
                analyticsInstance={ this.state.analyticsInstance }
                onChangeValue={ (field, value) => { this.changeValue(field, value); } }
                onChangeAnalyticsProcessorValue={
                  (i, field, value) => { this.changeAnalyticsProcessorValue(i, field, value); }
                }
                onChangeAnalyticsProcessorParameterValue={
                  (i, name, value) => { this.changeAnalyticsProcessorParameterValue(i, name, value); }
                }
                onAddAnalyticsProcessor={ () => { this.addAnalyticsProcessor(); } }
                onDeleteAnalyticsProcessor={ (i) => { this.deleteAnalyticsProcessor(i); } }
                onSave={ () => { this.saveAnalyticsInstance(); } }
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
    analyticsInstances: state.analyticsInstances.analyticsInstances,
    analyticsProcessorDefinitions: state.analyticsProcessorDefinitions.analyticsProcessorDefinitions,
    dataSources: state.dataSources.dataSources,
    edgeGateways: state.edgeGateways.edgeGateways
  };
};

const mapDispatchToProps = (dispatch) => {
  const _analyticsInstances = bindActionCreators(analyticsInstances, dispatch);
  const _analyticsProcessorDefinitions = bindActionCreators(analyticsProcessorDefinitions, dispatch);
  const _dataSources = bindActionCreators(dataSources, dispatch);
  const _edgeGateways = bindActionCreators(edgeGateways, dispatch);
  return {
    setAnalyticsInstances: _analyticsInstances.setAnalyticsInstances,
    setAnalyticsProcessorDefinitions: _analyticsProcessorDefinitions.setAnalyticsProcessorDefinitions,
    setDataSources: _dataSources.setDataSources,
    setEdgeGateways: _edgeGateways.setEdgeGateways
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsInstances);

