import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Container, Message, Modal, Segment } from 'semantic-ui-react';

import dataInterfaces from 'actions/data-interfaces';
import dataKinds from 'actions/data-kinds';
import dataSourceDefinitions from 'actions/data-source-definitions';
import DataSourceDefinitionForm from 'components/data-source-definitions/data-source-definition-form';
import DataSourceDefinitionTable from 'components/data-source-definitions/data-source-definition-table';
import { clean } from 'helpers/chisels';
import { tr } from 'helpers/languages';
import messages from 'helpers/messages';
import { send } from 'helpers/requests';

class DataSourceDefinitions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSourceDefinition: {
        name: '',
        description: '',
        dataInterfaceReferenceID: '',
        dataKindReferenceIDs: {
          dataKindReferenceID: [ ]
        }
      },
      modal: false
    };
    autoBind(this);
  }

  componentDidMount() {
    this.fetchDataInterfaces();
    this.fetchDataKinds();
    this.fetchDataSourceDefinitions();
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
      messages.error(tr('FAILED_TO_FETCH_DATA_INTERFACES', error.message));
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
      messages.error(tr('FAILED_TO_FETCH_DATA_KINDS', error.message));
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
      messages.error(tr('FAILED_TO_FETCH_DATA_SOURCE_DEFINITIONS', error.message));
    });
  }

  createDataSourceDefinition() {
    this.setState({
      dataSourceDefinition: {
        name: '',
        description: '',
        dataInterfaceReferenceID: '',
        dataKindReferenceIDs: {
          dataKindReferenceID: [ ]
        }
      },
      modal: true
    });
  }

  editDataSourceDefinition(dataSourceDefinition) {
    this.setState({
      dataSourceDefinition,
      modal: true
    });
  }

  saveDataSourceDefinition() {
    const dataSourceDefinition = clean(this.state.dataSourceDefinition);
    if (!dataSourceDefinition.name) {
      messages.error(tr('GIVE_NAME'));
      return;
    }
    if (!dataSourceDefinition.dataInterfaceReferenceID) {
      messages.error(tr('SELECT_DATA_INTERFACE'));
      return;
    }
    if (!dataSourceDefinition.dataKindReferenceIDs || !dataSourceDefinition.dataKindReferenceIDs.dataKindReferenceID) {
      messages.error(tr('SELECT_DATA_KINDS'));
      return;
    }
    // eslint-disable-next-line no-console
    console.log(dataSourceDefinition.id ? 'Create a data source definition.' :
      `Update the data source definition ${ dataSourceDefinition.id }.`);
    send({
      method: dataSourceDefinition.id ? 'PUT' : 'POST',
      url: dataSourceDefinition.id ?
        `${ process.env.MODEL_REPOSITORY_BASE_URL }/data-source-definitions/${ dataSourceDefinition.id}` :
        `${ process.env.MODEL_REPOSITORY_BASE_URL }/data-source-definitions`,
      data: {
        ...dataSourceDefinition
      }
    }).then((_data) => {
      this.fetchDataSourceDefinitions();
      this.hideModal();
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(dataSourceDefinition.id ?
        `Failed to update the data source definition ${ dataSourceDefinition.id }.` :
        'Failed to create a data source definition.', error);
      messages.error(tr('FAILED_TO_SAVE_DATA_SOURCE_DEFINITION', error.message));
    });
  }

  deleteDataSourceDefinition(dataSourceDefinition) {
    // eslint-disable-next-line no-console
    console.log(`Delete the data source definition ${ dataSourceDefinition.id }.`);
    send({
      method: 'DELETE',
      url: `${ process.env.MODEL_REPOSITORY_BASE_URL }/data-source-definitions/${ dataSourceDefinition.id }`
    }).then((_data) => {
      this.fetchDataSourceDefinitions();
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(`Failed to delete the data source definition ${ dataSourceDefinition.id }.`, error);
      messages.error(tr('FAILED_TO_DELETE_DATA_SOURCE_DEFINITION', error.message));
    });
  }

  changeValue(field, value) {
    const dataSourceDefinition = { ...this.state.dataSourceDefinition };
    if (field === 'dataKinds') {
      dataSourceDefinition.dataKindReferenceIDs.dataKindReferenceID = value;
    } else {
      dataSourceDefinition[field] = value;
    }
    setTimeout(() => {
      this.setState({ dataSourceDefinition });
    }, 0);
  }

  hideModal() {
    this.setState({ modal: false });
  }

  render() {
    // eslint-disable-next-line no-console
    console.log('Render the data source definitions.');
    return (
      <Container className='data-source-definitions pretty-scroll'>
        {
          this.props.dataSourceDefinitions.length > 0 && (
            <DataSourceDefinitionTable
              dataInterfaces={ this.props.dataInterfaces }
              dataKinds={ this.props.dataKinds }
              dataSourceDefinitions={ this.props.dataSourceDefinitions }
              onEdit={ (dataSourceDefinition) => { this.editDataSourceDefinition(dataSourceDefinition); } }
              onDelete={ (dataSourceDefinition) => { this.deleteDataSourceDefinition(dataSourceDefinition); } }
            />
          )
        }
        {
          this.props.dataSourceDefinitions.length === 0 && (
            <Message>{ tr('NO_DATA_SOURCE_DEFINITIONS') }</Message>
          )
        }
        <Button
          className='add-data-source-definition'
          onClick={ (_e) => { this.createDataSourceDefinition(); } }
        >
          { tr('ADD') }
        </Button>
        <Modal
          open={ this.state.modal }
          onClose={ () => { this.hideModal(); } }
          size='small'
        >
          <Segment>
            <Segment className='data-source-definition-form'>
              <DataSourceDefinitionForm
                dataInterfaces={ this.props.dataInterfaces }
                dataKinds={ this.props.dataKinds }
                dataSourceDefinition={ this.state.dataSourceDefinition }
                onChangeValue={ (field, value) => { this.changeValue(field, value); } }
                onSave={ () => { this.saveDataSourceDefinition(); } }
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
    dataKinds: state.dataKinds.dataKinds,
    dataSourceDefinitions: state.dataSourceDefinitions.dataSourceDefinitions
  };
};

const mapDispatchToProps = (dispatch) => {
  const _dataInterfaces = bindActionCreators(dataInterfaces, dispatch);
  const _dataKinds = bindActionCreators(dataKinds, dispatch);
  const _dataSourceDefinitions = bindActionCreators(dataSourceDefinitions, dispatch);
  return {
    setDataInterfaces: _dataInterfaces.setDataInterfaces,
    setDataKinds: _dataKinds.setDataKinds,
    setDataSourceDefinitions: _dataSourceDefinitions.setDataSourceDefinitions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataSourceDefinitions);

