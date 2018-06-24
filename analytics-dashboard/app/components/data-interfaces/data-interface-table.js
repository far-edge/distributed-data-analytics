import React from 'react';
import ReactTable from 'react-table';
import { Button, Container, Icon, Segment } from 'semantic-ui-react';

import { tr } from 'helpers/languages';

const DataInterfaceTable = (props) => {

  // eslint-disable-next-line no-console
  console.log('Render the data interface table.');
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
    id: 'communication-protocol',
    Header: tr('COMMUNICATION_PROTOCOL'),
    accessor: 'communicationProtocol',
    className: 'c-communication-protocol',
    headerClassName: 'h-communication-protocol'
  }, {
    id: 'parameters',
    Header: tr('PARAMETERS'),
    accessor: (dataInterface) => {
      return dataInterface.parameters && dataInterface.parameters.parameter ?
        dataInterface.parameters.parameter.map((p) => { return p.name; }).join(', ') : '';
    },
    className: 'c-parameters',
    headerClassName: 'h-parameters'
  }, {
    id: 'actions',
    Header: '',
    Cell: (row) => {
      const dataInterface = row.original;
      return (
        <Segment>
          <Button
            icon
            className='edit-data-interface'
            onClick={
              (_e) => {
                props.onEdit(dataInterface);
              }
            }
          >
            <Icon name='edit' />
          </Button>
          <Button
            icon
            className='delete-data-interface'
            onClick={
              (_e) => {
                props.onDelete(dataInterface);
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
        data={ props.dataInterfaces }
        minRows={ 0 }
        resizable={ false }
        showPagination={ false }
      />
    </Container>
  );

};

export default DataInterfaceTable;
