import React from 'react';
import { Button, Container, Divider, Dropdown, Form, Grid, Icon, Input, Segment, TextArea } from 'semantic-ui-react';

import AnalyticsProcessorForm from 'components/analytics-instances/analytics-processor-form';
import { tr } from 'helpers/languages';

const AnalyticsInstanceForm = (props) => {

  // eslint-disable-next-line no-console
  console.log('Render the analytics instance form.');
  const edgeGateways = props.edgeGateways.map((eg) => {
    return { key: eg.id, text: eg.name, value: eg.id };
  }).concat([{ key: '', text: ' ', value: '' }]);
  return (
    <Form>
      <Form.Field inline>
        <label>{ tr('EDGE_GATEWAY') }</label>
        <Dropdown
          fluid
          selection
          name='edgeGatewayReferenceID'
          options={ edgeGateways }
          value={ props.analyticsInstance.edgeGatewayReferenceID }
          onChange={ (_e, data) => { props.onChangeValue(data.name, data.value); } }
        />
      </Form.Field>
      <Form.Field>
        <label>{ tr('NAME') }</label>
        <Input
          name='name'
          type='text'
          value={ props.analyticsInstance.name }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field inline>
        <label>{ tr('DESCRIPTION') }</label>
        <TextArea
          name='description'
          value={ props.analyticsInstance.description }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Segment className='analytics-processors'>
        <div className='title'>{ tr('ANALYTICS_PROCESSORS') }</div>
        {
          /* eslint-disable react/no-array-index-key */
          props.analyticsInstance.analyticsProcessors.apm.map((apm, i) => {
            return (
              <Segment key={ `analytics-processor-${ i }` }>
                <Segment>
                  <div className='subtitle'>{ tr('ANALYTICS_PROCESSOR') } #{ i + 1 }</div>
                  {
                    i !== 0 ? (
                      <Icon
                        className='delete-analytics-processor'
                        name='delete'
                        onClick={ (_e) => { props.onDeleteAnalyticsProcessor(i); } }
                      />
                    ) : null
                  }
                </Segment>
                <Segment>
                  <AnalyticsProcessorForm
                    analyticsProcessorDefinitions={ props.analyticsProcessorDefinitions }
                    dataSources={ props.dataSources }
                    analyticsProcessor={ apm }
                    onChangeValue={ (field, value) => { props.onChangeAnalyticsProcessorValue(i, field, value); } }
                    onChangeParameterValue={
                      (name, value) => { props.onChangeAnalyticsProcessorParameterValue(i, name, value); }
                    }
                  />
                </Segment>
              </Segment>
            );
          })
        }
      </Segment>
      <Button
        onClick={
          (e) => {
            e.preventDefault();
            props.onAddAnalyticsProcessor();
          }
        }
      >
        { tr('ADD') }
      </Button>
      <Segment className='clearing actions'>
        <Button
          className='right floated'
          onClick={
            (e) => {
              e.preventDefault();
              props.onSave();
            }
          }
        >
          { tr('SAVE') }
        </Button>
        <Button
          className='right floated'
          onClick={
            (e) => {
              e.preventDefault();
              props.onCancel();
            }
          }
        >
          { tr('CANCEL') }
        </Button>
      </Segment>
    </Form>
  );

};

export default AnalyticsInstanceForm;
