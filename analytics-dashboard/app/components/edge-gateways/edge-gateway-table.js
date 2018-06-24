import React from 'react';
import ReactTable from 'react-table';
import { Button, Container, Icon, Segment } from 'semantic-ui-react';

import { tr } from 'helpers/languages';

const EdgeGatewayTable = (props) => {

  // eslint-disable-next-line no-console
  console.log('Render the edge gateway table.');
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
    id: 'namespace',
    Header: tr('NAMESPACE'),
    accessor: 'namespace',
    className: 'c-namespace',
    headerClassName: 'h-namespace'
  }, {
    id: 'components',
    Header: tr('COMPONENTS'),
    accessor: (edgeGateway) => {
      return (
        <div>
          <div><Icon name='random' /> { edgeGateway.dataRouterAndPreprocessorBaseURL }</div>
          <div><Icon name='chart line' /> { edgeGateway.edgeAnalyticsEngineBaseURL }</div>
        </div>
      );
    },
    className: 'c-components',
    headerClassName: 'h-components'
  }, {
    id: 'actions',
    Header: '',
    Cell: (row) => {
      const edgeGateway = row.original;
      return (
        <Segment>
          <Button
            icon
            className='edit-edge-gateway'
            onClick={
              (_e) => {
                props.onEdit(edgeGateway);
              }
            }
          >
            <Icon name='edit' />
          </Button>
          <Button
            icon
            className='delete-edge-gateway'
            onClick={
              (_e) => {
                props.onDelete(edgeGateway);
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
        data={ props.edgeGateways }
        minRows={ 0 }
        resizable={ false }
        showPagination={ false }
      />
    </Container>
  );

};

export default EdgeGatewayTable;
