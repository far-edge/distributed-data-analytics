import React from 'react';
import { Button, Form, Input, Segment, TextArea } from 'semantic-ui-react';

import { tr } from 'helpers/languages';

const EdgeGatewayForm = (props) => {

  // eslint-disable-next-line no-console
  console.log('Render the edge gateway form.');
  return (
    <Form>
      <Form.Field>
        <label>{ tr('NAME') }</label>
        <Input
          name='name'
          type='text'
          value={ props.edgeGateway.name }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field inline>
        <label>{ tr('DESCRIPTION') }</label>
        <TextArea
          name='description'
          value={ props.edgeGateway.description }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field>
        <label>{ tr('NAMESPACE') }</label>
        <Input
          name='namespace'
          type='text'
          value={ props.edgeGateway.namespace }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field>
        <label>{ tr('MAC_ADDRESS') }</label>
        <Input
          name='macAddress'
          type='text'
          value={ props.edgeGateway.macAddress }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field>
        <label>{ tr('LOCATION') }</label>
        <Input
          name='location'
          type='text'
          value={ props.edgeGateway.location ? props.edgeGateway.location.virtualLocation : '' }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field>
        <label>{ tr('DATA_ROUTER_AND_PREPROCESSOR_BASE_URL') }</label>
        <Input
          name='dataRouterAndPreprocessorBaseURL'
          type='text'
          value={ props.edgeGateway.dataRouterAndPreprocessorBaseURL }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field>
        <label>{ tr('EDGE_ANALYTICS_ENGINE_BASE_URL') }</label>
        <Input
          name='edgeAnalyticsEngineBaseURL'
          type='text'
          value={ props.edgeGateway.edgeAnalyticsEngineBaseURL }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field inline>
        <label>{ tr('ADDITIONAL_INFORMATION') }</label>
        <TextArea
          name='additionalInformation'
          value={
            props.edgeGateway.additionalInformation ? props.edgeGateway.additionalInformation[0] : ''
          }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
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

export default EdgeGatewayForm;
