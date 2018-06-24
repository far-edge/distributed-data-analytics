import React from 'react';
import { Button, Dropdown, Form, Input, Segment, TextArea } from 'semantic-ui-react';

import { tr } from 'helpers/languages';

const DataSourceDefinitionForm = (props) => {

  // eslint-disable-next-line no-console
  console.log('Render the data source definition form.');
  const dataInterfaces = props.dataInterfaces.map((di) => {
    return { key: di.id, text: di.name, value: di.id };
  });
  const dataKinds = props.dataKinds.map((dk) => {
    return { key: dk.id, text: dk.name, value: dk.id };
  });
  return (
    <Form>
      <Form.Field>
        <label>{ tr('NAME') }</label>
        <Input
          name='name'
          type='text'
          value={ props.dataSourceDefinition.name }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field inline>
        <label>{ tr('DESCRIPTION') }</label>
        <TextArea
          name='description'
          value={ props.dataSourceDefinition.description }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field inline>
        <label>{ tr('DATA_INTERFACE') }</label>
        <Dropdown
          fluid
          selection
          name='dataInterfaceReferenceID'
          options={ dataInterfaces }
          value={ props.dataSourceDefinition.dataInterfaceReferenceID }
          onChange={ (_e, data) => { props.onChangeValue(data.name, data.value); } }
        />
      </Form.Field>
      <Form.Field inline>
        <label>{ tr('DATA_KINDS') }</label>
        <Dropdown
          fluid
          multiple
          selection
          name='dataKinds'
          options={ dataKinds }
          value={
            props.dataSourceDefinition.dataKindReferenceIDs.dataKindReferenceID.map((dk) => {
              return dk.id || dk;
            })
          }
          onChange={ (e, data) => { props.onChangeValue(data.name, data.value); } }
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

export default DataSourceDefinitionForm;
