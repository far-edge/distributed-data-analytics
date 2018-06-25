import React from 'react';
import ReactTable from 'react-table';
import { Button, Container, Icon, Segment } from 'semantic-ui-react';

import { first } from 'helpers/chisels';
import { tr } from 'helpers/languages';

const AnalyticsInstanceTable = (props) => {

  // eslint-disable-next-line no-console
  console.log('Render the analytics instance table.');
  const columns = [{
    id: 'name',
    Header: tr('NAME'),
    accessor: 'specification.name',
    className: 'c-name',
    headerClassName: 'h-name'
  }, {
    id: 'description',
    Header: tr('DESCRIPTION'),
    accessor: 'specification.description',
    className: 'c-description',
    headerClassName: 'h-description'
  }, {
    id: 'edge-gateway',
    Header: tr('EDGE_GATEWAY'),
    Cell: (row) => {
      const analyticsInstance = row.original;
      const id = analyticsInstance.edgeGatewayReferenceID;
      const edgeGateway = id ? first(props.edgeGateways.filter((eg) => { return eg.id === id; })) : null;
      return id ? (
        <span>{ edgeGateway? edgeGateway.name : '' }</span>
      ) : (
        <Icon name='cloud' />
      );
    },
    className: 'c-edge-gateway',
    headerClassName: 'h-edge-gateway'
  }, {
    id: 'state',
    Header: tr('STATE'),
    accessor: (analyticsInstance) => {
      return tr(analyticsInstance.state);
    },
    className: 'c-number-of-analytics-processors',
    headerClassName: 'h-number-of-analytics-processors',
    width: 100
  }, {
    id: 'number-of-analytics-processors',
    Header: tr('NUMBER_OF_ANALYTICS_PROCESSORS'),
    accessor: (analyticsInstance) => {
      return analyticsInstance.specification.analyticsProcessors.apm.length;
    },
    className: 'c-number-of-analytics-processors',
    headerClassName: 'h-number-of-analytics-processors'
  }, {
    id: 'actions',
    Header: '',
    Cell: (row) => {
      const analyticsInstance = row.original;
      return (
        <Segment>
          <Button
            disabled={ analyticsInstance.state === 'RUNNING' }
            icon
            className='start-analytics-instance'
            onClick={
              (_e) => {
                props.onStart(analyticsInstance);
              }
            }
          >
            <Icon name='play' />
          </Button>
          <Button
            disabled={ analyticsInstance.state !== 'RUNNING' }
            icon
            className='stop-analytics-instance'
            onClick={
              (_e) => {
                props.onStop(analyticsInstance);
              }
            }
          >
            <Icon name='stop' />
          </Button>
          <Button
            disabled={ analyticsInstance.state === 'RUNNING' }
            icon
            className='edit-analytics-instance'
            onClick={
              (_e) => {
                props.onEdit(analyticsInstance);
              }
            }
          >
            <Icon name='edit' />
          </Button>
          <Button
            disabled={ analyticsInstance.state === 'RUNNING' }
            icon
            className='delete-analytics-instance'
            onClick={
              (_e) => {
                props.onDelete(analyticsInstance);
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
    width: 160,
    sortable: false
  }];
  return (
    <Container>
      <ReactTable
        columns={ columns }
        data={ props.analyticsInstances }
        minRows={ 0 }
        resizable={ false }
        showPagination={ false }
      />
    </Container>
  );

};

export default AnalyticsInstanceTable;
