import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Container, Message, Modal, Segment } from 'semantic-ui-react';

import dataKinds from 'actions/data-kinds';
import DataKindForm from 'components/data-kinds/data-kind-form';
import DataKindTable from 'components/data-kinds/data-kind-table';
import { clean } from 'helpers/chisels';
import { tr } from 'helpers/languages';
import messages from 'helpers/messages';
import { send } from 'helpers/requests';

class DataKinds extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataKind: {
        name: '',
        description: '',
        modelType: '',
        format: '',
        quantityKind: ''
      },
      modal: false
    };
    autoBind(this);
  }

  componentDidMount() {
    this.fetchDataKinds();
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

  createDataKind() {
    this.setState({
      dataKind: {
        name: '',
        description: '',
        modelType: '',
        format: '',
        quantityKind: ''
      },
      modal: true
    });
  }

  editDataKind(dataKind) {
    this.setState({
      dataKind,
      modal: true
    });
  }

  saveDataKind() {
    const dataKind = clean(this.state.dataKind);
    if (!dataKind.name) {
      messages.error(tr('GIVE_NAME'));
      return;
    }
    if (!dataKind.quantityKind) {
      messages.error(tr('GIVE_QUANTITY_KIND'));
      return;
    }
    // eslint-disable-next-line no-console
    console.log(dataKind.id ? 'Create a data kind.' : `Update the data kind ${ dataKind.id }.`);
    send({
      method: dataKind.id ? 'PUT' : 'POST',
      url: dataKind.id ? `${ process.env.MODEL_REPOSITORY_BASE_URL }/data-kinds/${ dataKind.id}` :
        `${ process.env.MODEL_REPOSITORY_BASE_URL }/data-kinds`,
      data: {
        ...dataKind
      }
    }).then((_data) => {
      this.fetchDataKinds();
      this.hideModal();
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(dataKind.id ? `Failed to update the data kind ${ dataKind.id }.` : 'Failed to create a data kind.',
        error);
      messages.error(`${ tr('FAILED_TO_SAVE_DATA_KIND') } ${ tr(error.message) }`);
    });
  }

  deleteDataKind(dataKind) {
    // eslint-disable-next-line no-console
    console.log(`Delete the data kind ${ dataKind.id }.`);
    send({
      method: 'DELETE',
      url: `${ process.env.MODEL_REPOSITORY_BASE_URL }/data-kinds/${ dataKind.id }`
    }).then((_data) => {
      this.fetchDataKinds();
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(`Failed to delete the data kind ${ dataKind.id }.`, error);
      messages.error(`${ tr('FAILED_TO_DELETE_DATA_KIND') } ${ tr(error.message) }`);
    });
  }

  changeValue(field, value) {
    const dataKind = { ...this.state.dataKind };
    dataKind[field] = value;
    this.setState({ dataKind });
  }

  hideModal() {
    this.setState({ modal: false });
  }

  render() {
    // eslint-disable-next-line no-console
    console.log('Render the data kinds.');
    return (
      <Container className='data-kinds pretty-scroll'>
        {
          this.props.dataKinds.length > 0 && (
            <DataKindTable
              dataKinds={ this.props.dataKinds }
              onEdit={ (dataKind) => { this.editDataKind(dataKind); } }
              onDelete={ (dataKind) => { this.deleteDataKind(dataKind); } }
            />
          )
        }
        {
          this.props.dataKinds.length === 0 && (
            <Message>{ tr('NO_DATA_KINDS') }</Message>
          )
        }
        <Button
          className='add-data-kind'
          onClick={ (_e) => { this.createDataKind(); } }
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
            <Segment className='data-kind-form'>
              <DataKindForm
                dataKind={ this.state.dataKind }
                onChangeValue={ (field, value) => { this.changeValue(field, value); } }
                onSave={ () => { this.saveDataKind(); } }
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
    dataKinds: state.dataKinds.dataKinds
  };
};

const mapDispatchToProps = (dispatch) => {
  const _dataKinds = bindActionCreators(dataKinds, dispatch);
  return {
    setDataKinds: _dataKinds.setDataKinds
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataKinds);

