import React from 'react';
import { Button, Dropdown, Form, Grid, Icon, Input, Segment, TextArea } from 'semantic-ui-react';

import { tr } from 'helpers/languages';

const AnalyticsProcessorForm = (props) => {

  // eslint-disable-next-line no-console
  console.log('Render the analytics processor form.');
  const analyticsProcessorDefinitions = props.analyticsProcessorDefinitions.map((apd) => {
    return { key: apd.id, text: apd.name, value: apd.id };
  });
  const dataSources = props.dataSources.map((ds) => {
    return { key: ds.id, text: ds.name, value: ds.id };
  }).concat([{ key: '', text: ' ', value: '' }]);
  return (
    <Segment>
      <Form.Field>
        <label>{ tr('NAME') }</label>
        <Input
          name='name'
          type='text'
          value={ props.analyticsProcessor.name }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field inline>
        <label>{ tr('DESCRIPTION') }</label>
        <TextArea
          name='description'
          value={ props.analyticsProcessor.description }
          onChange={ (e) => { props.onChangeValue(e.target.name, e.target.value); } }
        />
      </Form.Field>
      <Form.Field inline>
        <label>{ tr('ANALYTICS_PROCESSOR_DEFINITION') }</label>
        <Dropdown
          fluid
          selection
          name='analyticsProcessorDefinitionReferenceID'
          options={ analyticsProcessorDefinitions }
          value={ props.analyticsProcessor.analyticsProcessorDefinitionReferenceID }
          onChange={ (_e, data) => { props.onChangeValue(data.name, data.value); } }
        />
      </Form.Field>
      <Form.Field inline>
        <label>{ tr('DATA_SOURCES') }</label>
        <Dropdown
          fluid
          multiple
          selection
          name='dataSources'
          options={ dataSources }
          value={
            props.analyticsProcessor.dataSources.dataSource.map((ds) => {
              return ds.dataSourceManifestReferenceID;
            })
          }
          onChange={ (e, data) => { props.onChangeValue(data.name, data.value); } }
        />
      </Form.Field>
      <Form.Field inline>
        <label>{ tr('DATA_SINK') }</label>
        <Dropdown
          fluid
          selection
          name='dataSink'
          options={ dataSources }
          value={ props.analyticsProcessor.dataSink.dataSourceManifestReferenceID }
          onChange={ (_e, data) => { props.onChangeValue(data.name, data.value); } }
        />
      </Form.Field>
      {
        props.analyticsProcessor.parameters && props.analyticsProcessor.parameters.parameter &&
          props.analyticsProcessor.parameters.parameter.length ? (
            <Segment className='parameters'>
              <div className='title'>{ tr('PARAMETERS') }</div>
              <Grid columns={ 2 }>
                {
                  /* eslint-disable react/no-array-index-key */
                  props.analyticsProcessor.parameters &&
                    props.analyticsProcessor.parameters.parameter.map((parameter) => {
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
    </Segment>
  );
};

export default AnalyticsProcessorForm;
