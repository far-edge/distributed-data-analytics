import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Container, Message, Modal, Segment } from 'semantic-ui-react';

import dataInterfaces from 'actions/data-interfaces';
import DataInterfaceForm from 'components/data-interfaces/data-interface-form';
import DataInterfaceTable from 'components/data-interfaces/data-interface-table';
import { clean } from 'helpers/chisels';
import { tr } from 'helpers/languages';
import messages from 'helpers/messages';
import { send } from 'helpers/requests';

class DataInterfaces extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataInterface: {
        name: '',
        description: '',
        communicationProtocol: '',
        parameters: {
          parameter: [ ]
        }
      },
      modal: false
    };
    autoBind(this);
  }

  componentDidMount() {
    this.fetchDataInterfaces();
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

  addParameter() {
    const parameters = this.state.dataInterface.parameters;
    this.setState({
      dataInterface: {
        ...this.state.dataInterface,
        parameters: {
          parameter: parameters.parameter.concat([{
            name: '',
            description: '',
            dataType: '',
            defaultValue: ''
          }])
        }
      }
    });
  }

  deleteParameter(i) {
    const dataInterface = this.state.dataInterface;
    dataInterface.parameters.parameter.splice(i, 1);
    setTimeout(() => {
      this.setState({ dataInterface });
    }, 0);
  }

  createDataInterface() {
    this.setState({
      dataInterface: {
        name: '',
        description: '',
        communicationProtocol: '',
        parameters: {
          parameter: [ ]
        }
      },
      modal: true
    });
  }

  editDataInterface(dataInterface) {
    this.setState({
      dataInterface,
      modal: true
    });
  }

  saveDataInterface() {
    const dataInterface = clean(this.state.dataInterface);
    if (!dataInterface.name) {
      messages.error(tr('GIVE_NAME'));
      return;
    }
    const parameters = dataInterface.parameters ? dataInterface.parameters.parameter : [];
    if (parameters && parameters.length) {
      if (parameters.some((p) => { return !p.name; })) {
        messages.error(tr('GIVE_PARAMETER_NAME'));
        return;
      }
    }
    // eslint-disable-next-line no-console
    console.log(dataInterface.id ? 'Create a data interface.' : `Update the data interface ${ dataInterface.id }.`);
    send({
      method: dataInterface.id ? 'PUT' : 'POST',
      url: dataInterface.id ? `${ process.env.MODEL_REPOSITORY_BASE_URL }/data-interfaces/${ dataInterface.id }` :
        `${ process.env.MODEL_REPOSITORY_BASE_URL }/data-interfaces`,
      data: {
        ...dataInterface
      }
    }).then((_data) => {
      this.fetchDataInterfaces();
      this.hideModal();
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(dataInterface.id ? `Failed to update the data interface ${ dataInterface.id }.` :
        'Failed to create a data interface.', error);
      messages.error(tr('FAILED_TO_SAVE_DATA_INTERFACE', error.message));
    });
  }

  deleteDataInterface(dataInterface) {
    // eslint-disable-next-line no-console
    console.log(`Delete the data interface ${ dataInterface.id }.`);
    send({
      method: 'DELETE',
      url: `${ process.env.MODEL_REPOSITORY_BASE_URL }/data-interfaces/${ dataInterface.id }`
    }).then((_data) => {
      this.fetchDataInterfaces();
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(`Failed to delete the data interface ${ dataInterface.id }.`, error);
      messages.error(tr('FAILED_TO_DELETE_DATA_INTERFACE', error.message));
    });
  }

  changeParameterValue(i, field, value) {
    const dataInterface = { ...this.state.dataInterface };
    dataInterface.parameters.parameter[i][field] = value;
    this.setState({ dataInterface });
  }

  changeValue(field, value) {
    const dataInterface = { ...this.state.dataInterface };
    dataInterface[field] = value;
    this.setState({ dataInterface });
  }

  hideModal() {
    this.setState({ modal: false });
  }

  render() {
    // eslint-disable-next-line no-console
    console.log('Render the data interfaces.');
    return (
      <Container className='data-interfaces pretty-scroll'>
        {
          this.props.dataInterfaces.length > 0 && (
            <DataInterfaceTable
              dataInterfaces={ this.props.dataInterfaces }
              onEdit={ (dataInterface) => { this.editDataInterface(dataInterface); } }
              onDelete={ (dataInterface) => { this.deleteDataInterface(dataInterface); } }
            />
          )
        }
        {
          this.props.dataInterfaces.length === 0 && (
            <Message>{ tr('NO_DATA_INTERFACES') }</Message>
          )
        }
        <Button
          className='add-data-interface'
          onClick={ (_e) => { this.createDataInterface(); } }
        >
          { tr('ADD') }
        </Button>
        <Modal
          open={ this.state.modal }
          onClose={ () => { this.hideModal(); } }
          size='small'
        >
          <Segment>
            <Segment className='data-interface-form'>
              <DataInterfaceForm
                dataInterface={ this.state.dataInterface }
                onChangeParameterValue={ (i, field, value) => { this.changeParameterValue(i, field, value); } }
                onChangeValue={ (field, value) => { this.changeValue(field, value); } }
                onAddParameter={ () => { this.addParameter(); } }
                onDeleteParameter={ (i) => { this.deleteParameter(i); } }
                onSave={ () => { this.saveDataInterface(); } }
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
    dataInterfaces: state.dataInterfaces.dataInterfaces
  };
};

const mapDispatchToProps = (dispatch) => {
  const _dataInterfaces = bindActionCreators(dataInterfaces, dispatch);
  return {
    setDataInterfaces: _dataInterfaces.setDataInterfaces
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataInterfaces);

