import React from 'react';
import { Button, Form, Icon, Input, Segment, TextArea } from 'semantic-ui-react';

import { tr } from 'helpers/languages';

const AnalyticsProcessorDefinitionForm = (props) => {

  // eslint-disable-next-line no-console
  console.log('Render the analytics processor definition form.');
  return (
    <Form>
      <Form.Field>
        <label>{ tr('NAME') }</label>
        <Input
          name='name'
          type='text'
          value={ props.analyticsProcessorDefinition.name }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field inline>
        <label>{ tr('DESCRIPTION') }</label>
        <TextArea
          name='description'
          value={ props.analyticsProcessorDefinition.description }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field>
        <label>{ tr('PROCESSOR_TYPE') }</label>
        <Input
          name='processorType'
          type='text'
          value={ props.analyticsProcessorDefinition.processorType }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field>
        <label>{ tr('VERSION') }</label>
        <Input
          name='version'
          type='text'
          value={ props.analyticsProcessorDefinition.version }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field>
        <label>{ tr('COPYRIGHT') }</label>
        <Input
          name='copyright'
          type='text'
          value={ props.analyticsProcessorDefinition.copyright }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field>
        <label>{ tr('PROCESSOR_LOCATION') }</label>
        <Input
          name='processorLocation'
          type='text'
          value={ props.analyticsProcessorDefinition.processorLocation }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field inline>
        <label>{ tr('ADDITIONAL_INFORMATION') }</label>
        <TextArea
          name='additionalInformation'
          value={
            props.analyticsProcessorDefinition.additionalInformation ?
              props.analyticsProcessorDefinition.additionalInformation[0] : ''
          }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Segment className='parameters'>
        <div className='title'>{ tr('PARAMETERS') }</div>
        {
          /* eslint-disable react/no-array-index-key */
          props.analyticsProcessorDefinition.parameters &&
            props.analyticsProcessorDefinition.parameters.parameter.map((parameter, i) => {
              return (
                <Form.Group
                  className={ `parameter ${ i === 0 ? 'first' : '' } ` }
                  widths='equal'
                  key={ `parameter-${ i }` }
                >
                  <Form.Input
                    fluid
                    label={ i === 0 ? tr('NAME') : null }
                    value={ parameter.name }
                    onChange={ (e) => { props.onChangeParameterValue(i, 'name', e.target.value); } }
                  />
                  <Form.Input
                    fluid
                    label={ i === 0 ? tr('DESCRIPTION') : null }
                    value={ parameter.description }
                    onChange={ (e) => { props.onChangeParameterValue(i, 'description', e.target.value); } }
                  />
                  <Form.Input
                    fluid
                    label={ i === 0 ? tr('DATA_TYPE') : null }
                    value={ parameter.dataType }
                    onChange={ (e) => { props.onChangeParameterValue(i, 'dataType', e.target.value); } }
                  />
                  <Form.Input
                    fluid
                    label={ i === 0 ? tr('DEFAULT_VALUE') : null }
                    value={ parameter.defaultValue }
                    onChange={ (e) => { props.onChangeParameterValue(i, 'defaultValue', e.target.value); } }
                  />
                  <Icon
                    name='delete'
                    onClick={ (_e) => { props.onDeleteParameter(i); } }
                  />
                </Form.Group>
              );
            })
          /* eslint-enable react/no-array-index-key */
        }
      </Segment>
      <Button
        onClick={
          (e) => {
            e.preventDefault();
            props.onAddParameter();
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

export default AnalyticsProcessorDefinitionForm;
