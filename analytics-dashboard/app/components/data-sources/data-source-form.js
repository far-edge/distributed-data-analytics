import React from 'react';
import { Button, Dropdown, Form, Grid, Input, Segment, TextArea } from 'semantic-ui-react';

import { tr } from 'helpers/languages';

const DataSourceForm = (props) => {

  // eslint-disable-next-line no-console
  console.log('Render the data source form.');
  const dataSourceDefinitions = props.dataSourceDefinitions.map((dsd) => {
    return { key: dsd.id, text: dsd.name, value: dsd.id };
  });
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
          value={ props.dataSource.edgeGatewayReferenceID }
          onChange={ (_e, data) => { props.onChangeValue(data.name, data.value); } }
        />
      </Form.Field>
      <Form.Field>
        <label>{ tr('NAME') }</label>
        <Input
          name='name'
          type='text'
          value={ props.dataSource.name }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field inline>
        <label>{ tr('DESCRIPTION') }</label>
        <TextArea
          name='description'
          value={ props.dataSource.description }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field>
        <label>{ tr('MAC_ADDRESS') }</label>
        <Input
          name='macAddress'
          type='text'
          value={ props.dataSource.macAddress }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field inline>
        <label>{ tr('DATA_SOURCE_DEFINITION') }</label>
        <Dropdown
          fluid
          selection
          name='dataSourceDefinitionReferenceID'
          options={ dataSourceDefinitions }
          value={ props.dataSource.dataSourceDefinitionReferenceID }
          onChange={ (_e, data) => { props.onChangeValue(data.name, data.value); } }
        />
      </Form.Field>
      {
        props.dataSource.dataSourceDefinitionInterfaceParameters &&
          props.dataSource.dataSourceDefinitionInterfaceParameters.parameter &&
          props.dataSource.dataSourceDefinitionInterfaceParameters.parameter.length ? (
            <Segment className='parameters'>
              <div className='title'>{ tr('PARAMETERS') }</div>
              <Grid columns={ 2 }>
                {
                  /* eslint-disable react/no-array-index-key */
                  props.dataSource.dataSourceDefinitionInterfaceParameters &&
                  props.dataSource.dataSourceDefinitionInterfaceParameters.parameter.map((parameter) => {
                    return (
                      <Grid.Column key={ `parameter-${ parameter.key }` }>
                        <Form.Field>
                          <Input
                            label={ parameter.key }
                            type='text'
                            value={ parameter.value }
                            onChange={ (e) => { props.onChangeParameterValue(parameter.key, e.target.value); } }
                          />
                        </Form.Field>
                      </Grid.Column>
                    );
                  })
                  /* eslint-enable react/no-array-index-key */
                }
              </Grid>
            </Segment>
          ) : null
      }
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

export default DataSourceForm;
