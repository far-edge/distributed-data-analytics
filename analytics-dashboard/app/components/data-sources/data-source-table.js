import React from 'react';
import ReactTable from 'react-table';
import { Button, Container, Icon, Segment } from 'semantic-ui-react';

import { first } from 'helpers/chisels';
import { tr } from 'helpers/languages';

const DataSourceTable = (props) => {

  // eslint-disable-next-line no-console
  console.log('Render the data source table.');
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
    id: 'edge-gateway',
    Header: tr('EDGE_GATEWAY'),
    accessor: (dataSource) => {
      const id = dataSource.edgeGatewayReferenceID;
      return id ? first(props.edgeGateways.filter((eg) => { return eg.id === id; })).name : '';
    },
    className: 'c-edge-gateway',
    headerClassName: 'h-edge-gateway'
  }, {
    id: 'data-source-definition',
    Header: tr('DATA_SOURCE_DEFINITION'),
    accessor: (dataSource) => {
      const id = dataSource.dataSourceDefinition;
      return id ? first(props.dataSourceDefinitions.filter((dsd) => { return dsd.id === id; })).name : '';
    },
    className: 'c-data-source-definition',
    headerClassName: 'h-data-source-definition'
  }, {
    id: 'parameters',
    Header: tr('PARAMETERS'),
    accessor: (dataSource) => {
      return dataSource.dataSourceDefinitionInterfaceParameters &&
        dataSource.dataSourceDefinitionInterfaceParameters.parameter ?
        dataSource.dataSourceDefinitionInterfaceParameters.parameter.map((p) => {
          return `${ p.key } = ${ p.value }`;
        }).join(', ') : '';
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
        data={ props.dataSources }
        minRows={ 0 }
        resizable={ false }
        showPagination={ false }
      />
    </Container>
  );

};

export default DataSourceTable;
