import React from 'react';
import { Button, Form, Input, Segment, TextArea } from 'semantic-ui-react';

import { tr } from 'helpers/languages';

const DataKindForm = (props) => {

  // eslint-disable-next-line no-console
  console.log('Render the data kind form.');
  return (
    <Form>
      <Form.Field>
        <label>{ tr('NAME') }</label>
        <Input
          name='name'
          type='text'
          value={ props.dataKind.name }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field inline>
        <label>{ tr('DESCRIPTION') }</label>
        <TextArea
          name='description'
          value={ props.dataKind.description }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field>
        <label>{ tr('MODEL_TYPE') }</label>
        <Input
          name='modelType'
          type='text'
          value={ props.dataKind.modelType }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field>
        <label>{ tr('FORMAT') }</label>
        <Input
          name='format'
          type='text'
          value={ props.dataKind.format }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field>
        <label>{ tr('QUANTITY_KIND') }</label>
        <Input
          name='quantityKind'
          type='text'
          value={ props.dataKind.quantityKind }
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

export default DataKindForm;
