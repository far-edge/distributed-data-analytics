import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Container, Message, Modal, Segment } from 'semantic-ui-react';

import analyticsProcessorDefinitions from 'actions/analytics-processor-definitions';
import AnalyticsProcessorDefinitionForm from
  'components/analytics-processor-definitions/analytics-processor-definition-form';
import AnalyticsProcessorDefinitionTable
  from 'components/analytics-processor-definitions/analytics-processor-definition-table';
import { clean } from 'helpers/chisels';
import { tr } from 'helpers/languages';
import messages from 'helpers/messages';
import { send } from 'helpers/requests';

class AnalyticsProcessorDefinitions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      analyticsProcessorDefinition: {
        name: '',
        description: '',
        processorType: '',
        version: '',
        copyright: '',
        processorLocation: '',
        additionalInformation: '',
        parameters: {
          parameter: [ ]
        }
      },
      modal: false
    };
    autoBind(this);
  }

  componentDidMount() {
    this.fetchAnalyticsProcessorDefinitions();
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

  addParameter() {
    const parameters = this.state.analyticsProcessorDefinition.parameters;
    this.setState({
      analyticsProcessorDefinition: {
        ...this.state.analyticsProcessorDefinition,
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
    const analyticsProcessorDefinition = this.state.analyticsProcessorDefinition;
    analyticsProcessorDefinition.parameters.parameter.splice(i, 1);
    setTimeout(() => {
      this.setState({ analyticsProcessorDefinition });
    }, 0);
  }

  createAnalyticsProcessorDefinition() {
    this.setState({
      analyticsProcessorDefinition: {
        name: '',
        description: '',
        processorType: '',
        version: '',
        copyright: '',
        processorLocation: '',
        additionalInformation: '',
        parameters: {
          parameter: [ ]
        }
      },
      modal: true
    });
  }

  editAnalyticsProcessorDefinition(analyticsProcessorDefinition) {
    this.setState({
      analyticsProcessorDefinition,
      modal: true
    });
  }

  saveAnalyticsProcessorDefinition() {
    const analyticsProcessorDefinition = clean(this.state.analyticsProcessorDefinition);
    if (!analyticsProcessorDefinition.name) {
      messages.error(tr('GIVE_NAME'));
      return;
    }
    if (!analyticsProcessorDefinition.processorType) {
      messages.error(tr('GIVE_PROCESSOR_TYPE'));
      return;
    }
    const parameters = analyticsProcessorDefinition.parameters ? analyticsProcessorDefinition.parameters.parameter : [];
    if (parameters && parameters.length) {
      if (parameters.some((p) => { return !p.name; })) {
        messages.error(tr('GIVE_PARAMETER_NAME'));
        return;
      }
    }
    // eslint-disable-next-line no-console
    const id = analyticsProcessorDefinition.id;
    console.log(analyticsProcessorDefinition.id ? 'Create an analytics processor definition.' :
      `Update the analytics processor definition ${ id }.`);
    send({
      method: id ? 'PUT' : 'POST',
      url: id ? `${ process.env.MODEL_REPOSITORY_BASE_URL }/analytics-processor-definitions/${ id }` :
        `${ process.env.MODEL_REPOSITORY_BASE_URL }/analytics-processor-definitions`,
      data: {
        ...analyticsProcessorDefinition
      }
    }).then((_data) => {
      this.fetchAnalyticsProcessorDefinitions();
      this.hideModal();
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(id ? `Failed to update the analytics processor definition ${ id }.` :
        'Failed to create an analytics processor definition.', error);
      messages.error(`${ tr('FAILED_TO_SAVE_ANALYTICS_PROCESSOR_DEFINITION') } ${ tr(error.message) }`);
    });
  }

  deleteAnalyticsProcessorDefinition(analyticsProcessorDefinition) {
    const id = analyticsProcessorDefinition.id;
    // eslint-disable-next-line no-console
    console.log(`Delete the analytics processor defintion ${ id }.`);
    send({
      method: 'DELETE',
      url: `${ process.env.MODEL_REPOSITORY_BASE_URL }/analytics-processor-definitions/${ id }`
    }).then((_data) => {
      this.fetchAnalyticsProcessorDefinitions();
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(`Failed to delete the analytics processor definition ${ id }.`, error);
      messages.error(`${ tr('FAILED_TO_DELETE_DATA_INTERFACE') } ${ tr(error.message) }`);
    });
  }

  changeParameterValue(i, field, value) {
    const analyticsProcessorDefinition = { ...this.state.analyticsProcessorDefinition };
    analyticsProcessorDefinition.parameters.parameter[i][field] = value;
    this.setState({ analyticsProcessorDefinition });
  }

  changeValue(field, value) {
    const analyticsProcessorDefinition = { ...this.state.analyticsProcessorDefinition };
    if (field === 'additionalInformation') {
      analyticsProcessorDefinition.additionalInformation = [ value ];
    } else {
      analyticsProcessorDefinition[field] = value;
    }
    this.setState({ analyticsProcessorDefinition });
  }

  hideModal() {
    this.setState({ modal: false });
  }

  render() {
    // eslint-disable-next-line no-console
    console.log('Render the analytics processor definitions.');
    return (
      <Container className='analytics-processor-definitions pretty-scroll'>
        {
          this.props.analyticsProcessorDefinitions.length > 0 && (
            <AnalyticsProcessorDefinitionTable
              analyticsProcessorDefinitions={ this.props.analyticsProcessorDefinitions }
              onEdit={
                (analyticsProcessorDefinition) => {
                  this.editAnalyticsProcessorDefinition(analyticsProcessorDefinition);
                }
              }
              onDelete={
                (analyticsProcessorDefinition) => {
                  this.deleteAnalyticsProcessorDefinition(analyticsProcessorDefinition);
                }
              }
            />
          )
        }
        {
          this.props.analyticsProcessorDefinitions.length === 0 && (
            <Message>{ tr('NO_ANALYTICS_PROCESSOR_DEFINITIONS') }</Message>
          )
        }
        <Button
          className='add-analytics-processor-definition'
          onClick={ (_e) => { this.createAnalyticsProcessorDefinition(); } }
        >
          { tr('ADD') }
        </Button>
        <Modal
          open={ this.state.modal }
          onClose={ () => { this.hideModal(); } }
          size='small'
        >
          <Segment>
            <Segment className='analytics-processor-definition-form'>
              <AnalyticsProcessorDefinitionForm
                analyticsProcessorDefinition={ this.state.analyticsProcessorDefinition }
                onChangeParameterValue={ (i, field, value) => { this.changeParameterValue(i, field, value); } }
                onChangeValue={ (field, value) => { this.changeValue(field, value); } }
                onAddParameter={ () => { this.addParameter(); } }
                onDeleteParameter={ (i) => { this.deleteParameter(i); } }
                onSave={ () => { this.saveAnalyticsProcessorDefinition(); } }
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
    analyticsProcessorDefinitions: state.analyticsProcessorDefinitions.analyticsProcessorDefinitions
  };
};

const mapDispatchToProps = (dispatch) => {
  const _analyticsProcessorDefinitions = bindActionCreators(analyticsProcessorDefinitions, dispatch);
  return {
    setAnalyticsProcessorDefinitions: _analyticsProcessorDefinitions.setAnalyticsProcessorDefinitions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsProcessorDefinitions);

