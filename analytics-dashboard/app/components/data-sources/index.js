import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Container, Message, Modal, Segment } from 'semantic-ui-react';

import dataInterfaces from 'actions/data-interfaces';
import dataSources from 'actions/data-sources';
import dataSourceDefinitions from 'actions/data-source-definitions';
import edgeGateways from 'actions/edge-gateways';
import DataSourceForm from 'components/data-sources/data-source-form';
import DataSourceTable from 'components/data-sources/data-source-table';
import { clean, first } from 'helpers/chisels';
import { tr } from 'helpers/languages';
import messages from 'helpers/messages';
import { send } from 'helpers/requests';

class DataSources extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: {
        edgeGatewayReferenceID: '',
        name: '',
        description: '',
        macAddress: '',
        dataSourceDefinitionReferenceID: '',
        dataSourceDefinitionInterfaceParameters: {
          parameter: [ ]
        }
      },
      modal: false
    };
    autoBind(this);
  }

  componentDidMount() {
    this.fetchDataInterfaces();
    this.fetchDataSourceDefinitions();
    this.fetchDataSources();
    this.fetchEdgeGateways();
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

  registerDataSource() {
    this.setState({
      dataSource: {
        edgeGatewayReferenceID: '',
        name: '',
        description: '',
        macAddress: '',
        dataSourceDefinitionReferenceID: '',
        dataSourceDefinitionInterfaceParameters: {
          parameter: [ ]
        }
      },
      modal: true
    });
  }

  saveDataSource() {
    const dataSource = clean(this.state.dataSource);
    if (!dataSource.name) {
      messages.error(tr('GIVE_NAME'));
      return;
    }
    if (!dataSource.macAddress) {
      messages.error(tr('GIVE_MAC_ADDRESS'));
      return;
    }
    if (!dataSource.dataSourceDefinitionReferenceID) {
      messages.error(tr('SELECT_DATA_SOURCE_DEFINITION'));
      return;
    }
    const filled = dataSource.dataSourceDefinitionInterfaceParameters.parameter.filter((p) => {
      return !!p.value;
    });
    const data = {
      ...dataSource
    };
    if (filled.length) {
      data.dataSourceDefinitionInterfaceParameters.parameter = filled;
    } else {
      delete data.dataSourceDefinitionInterfaceParameters;
    }
    // eslint-disable-next-line no-console
    console.log('Register a data source.');
    send({
      method: 'POST',
      url: dataSource.edgeGatewayReferenceID ?
        `${ process.env.OPEN_API_FOR_ANALYTICS_BASE_URL }/data-sources?edgeGatewayReferenceID=${ dataSource.edgeGatewayReferenceID }` :
        `${ process.env.OPEN_API_FOR_ANALYTICS_BASE_URL }/data-sources`,
      data
    }).then((_data) => {
      this.fetchDataSources();
      this.hideModal();
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to register a data source.', error);
      messages.error(`${ tr('FAILED_TO_SAVE_DATA_SOURCE') } ${ tr(error.message) }`);
    });
  }

  unregisterDataSource(dataSource) {
    // eslint-disable-next-line no-console
    console.log(`Unregister the data source ${ dataSource.id }.`);
    send({
      method: 'DELETE',
      url: dataSource.edgeGatewayReferenceID ?
        `${ process.env.OPEN_API_FOR_ANALYTICS_BASE_URL }/data-sources/${ dataSource.id }?edgeGatewayReferenceID=${ dataSource.edgeGatewayReferenceID }` :
        `${ process.env.OPEN_API_FOR_ANALYTICS_BASE_URL }/data-sources/${ dataSource.id }`
    }).then((_data) => {
      this.fetchDataSources();
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(`Failed to unregister the data source ${ dataSource.id }.`, error);
      messages.error(`${ tr('FAILED_TO_DELETE_DATA_SOURCE') } ${ tr(error.message) }`);
    });
  }

  changeValue(field, value) {
    const dataSource = { ...this.state.dataSource };
    if (field === 'dataSourceDefinitionReferenceID' && value !== dataSource.dataSourceDefinitionReferenceID) {
      const parameters = first(this.props.dataSourceDefinitions.filter((dsd) => {
        return dsd.id === value;
      }).map((dsd) => {
        return first(this.props.dataInterfaces.filter((di) => {
          return di.id === dsd.dataInterfaceReferenceID;
        }));
      }).map((di) => {
        return di.parameters && di.parameters.parameter ? di.parameters.parameter : [];
      }));
      dataSource.dataSourceDefinitionInterfaceParameters.parameter = parameters.map((p) => {
        return { key: p.name, value: p.defaultValue || '' };
      });
    }
    dataSource[field] = value;
    this.setState({ dataSource });
  }

  changeParameterValue(name, value) {
    const dataSource = { ...this.state.dataSource };
    dataSource.dataSourceDefinitionInterfaceParameters.parameter =
      dataSource.dataSourceDefinitionInterfaceParameters.parameter.map((p) => {
        return p.key === name ? { key: p.key, value } : p;
      });
    this.setState({ dataSource });
  }

  hideModal() {
    this.setState({ modal: false });
  }

  render() {
    // eslint-disable-next-line no-console
    console.log('Render the data sources.');
    return (
      <Container className='data-sources pretty-scroll'>
        {
          this.props.dataSources.length > 0 && (
            <DataSourceTable
              edgeGateways={ this.props.edgeGateways }
              dataSourceDefinitions={ this.props.dataSourceDefinitions }
              dataSources={ this.props.dataSources }
              onDelete={ (dataSource) => { this.unregisterDataSource(dataSource); } }
            />
          )
        }
        {
          this.props.dataSources.length === 0 && (
            <Message>{ tr('NO_DATA_SOURCES') }</Message>
          )
        }
        <Button
          className='add-data-source'
          onClick={ (_e) => { this.registerDataSource(); } }
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
            <Segment className='data-source-form'>
              <DataSourceForm
                dataSourceDefinitions={ this.props.dataSourceDefinitions }
                edgeGateways={ this.props.edgeGateways }
                dataSource={ this.state.dataSource }
                onChangeValue={ (field, value) => { this.changeValue(field, value); } }
                onChangeParameterValue={ (name, value) => { this.changeParameterValue(name, value); } }
                onSave={ () => { this.saveDataSource(); } }
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
    dataInterfaces: state.dataInterfaces.dataInterfaces,
    dataSources: state.dataSources.dataSources,
    dataSourceDefinitions: state.dataSourceDefinitions.dataSourceDefinitions,
    edgeGateways: state.edgeGateways.edgeGateways
  };
};

const mapDispatchToProps = (dispatch) => {
  const _dataInterfaces = bindActionCreators(dataInterfaces, dispatch);
  const _dataSources = bindActionCreators(dataSources, dispatch);
  const _dataSourceDefinitions = bindActionCreators(dataSourceDefinitions, dispatch);
  const _edgeGateways = bindActionCreators(edgeGateways, dispatch);
  return {
    setDataInterfaces: _dataInterfaces.setDataInterfaces,
    setDataSources: _dataSources.setDataSources,
    setDataSourceDefinitions: _dataSourceDefinitions.setDataSourceDefinitions,
    setEdgeGateways: _edgeGateways.setEdgeGateways
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataSources);

