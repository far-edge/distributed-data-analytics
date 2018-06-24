import React from 'react';
import ReactTable from 'react-table';
import { Button, Container, Icon, Segment } from 'semantic-ui-react';

import { tr } from 'helpers/languages';

const AnalyticsProcessorDefinitionTable = (props) => {

  // eslint-disable-next-line no-console
  console.log('Render the analytics processor definition table.');
  const columns = [{
    id: 'name',
    Header: tr('NAME'),
    accessor: 'name',
    className: 'c-name',
    headerClassName: 'h-name'
  }, {
    id: 'description',
    Header: tr('DESCRIPTION'),
    accessor: 'description',
    className: 'c-description',
    headerClassName: 'h-description'
  }, {
    id: 'processor-type',
    Header: tr('PROCESSOR_TYPE'),
    accessor: 'processorType',
    className: 'c-processor-type',
    headerClassName: 'h-processor-type'
  }, {
    id: 'version',
    Header: tr('VERSION'),
    accessor: 'version',
    className: 'c-version',
    headerClassName: 'h-version'
  }, {
    id: 'parameters',
    Header: tr('PARAMETERS'),
    accessor: (analyticsProcessorDefinition) => {
      return analyticsProcessorDefinition.parameters && analyticsProcessorDefinition.parameters.parameter ?
        analyticsProcessorDefinition.parameters.parameter.map((p) => { return p.name; }).join(', ') : '';
    },
    className: 'c-parameters',
    headerClassName: 'h-parameters'
  }, {
    id: 'actions',
    Header: '',
    Cell: (row) => {
      const analyticsProcessorDefinition = row.original;
      return (
        <Segment>
          <Button
            icon
            className='edit-analytics-processor-definition'
            onClick={
              (_e) => {
                props.onEdit(analyticsProcessorDefinition);
              }
            }
          >
            <Icon name='edit' />
          </Button>
          <Button
            icon
            className='delete-analytics-processor-definition'
            onClick={
              (_e) => {
                props.onDelete(analyticsProcessorDefinition);
              }
            }
          >
            <Icon name='delete' />
          </Button>
        </Segment>
      );
    },
    className: 'c-actions',
    headerClassName: 'h-actions',
    width: 85,
    sortable: false
  }];
  return (
    <Container>
      <ReactTable
        columns={ columns }
        data={ props.analyticsProcessorDefinitions }
        minRows={ 0 }
        resizable={ false }
        showPagination={ false }
      />
    </Container>
  );

};

export default AnalyticsProcessorDefinitionTable;
