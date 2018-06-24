import React from 'react';
import ReactTable from 'react-table';
import { Button, Container, Icon, Segment } from 'semantic-ui-react';

import { tr } from 'helpers/languages';

const DataKindTable = (props) => {

  // eslint-disable-next-line no-console
  console.log('Render the data kind table.');
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
    id: 'model-type',
    Header: tr('MODEL_TYPE'),
    accessor: 'modelType',
    className: 'c-model-type',
    headerClassName: 'h-model-type'
  }, {
    id: 'format',
    Header: tr('FORMAT'),
    accessor: 'format',
    className: 'c-format',
    headerClassName: 'h-format'
  }, {
    id: 'quantity-kind',
    Header: tr('QUANTITY_KIND'),
    accessor: 'quantityKind',
    className: 'c-quantity-kind',
    headerClassName: 'h-quantity-kind'
  }, {
    id: 'actions',
    Header: '',
    Cell: (row) => {
      const dataKind = row.original;
      return (
        <Segment>
          <Button
            icon
            className='edit-data-kind'
            onClick={
              (_e) => {
                props.onEdit(dataKind);
              }
            }
          >
            <Icon name='edit' />
          </Button>
          <Button
            icon
            className='delete-data-kind'
            onClick={
              (_e) => {
                props.onDelete(dataKind);
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
        data={ props.dataKinds }
        minRows={ 0 }
        resizable={ false }
        showPagination={ false }
      />
    </Container>
  );

};

export default DataKindTable;
