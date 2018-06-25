import React, { Component } from 'react';
import autoBind from 'react-autobind';
import LineChart from 'react-linechart';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Dropdown, Form } from 'semantic-ui-react';

import dataSources from 'actions/data-sources';
import { first } from 'helpers/chisels';
import { tr } from 'helpers/languages';
import messages from 'helpers/messages';
import { send } from 'helpers/requests';

class Data extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
      data: [
        {
          color: 'steelblue',
          points: [{ x: 1, y: 2 }, { x: 2, y: 5 }, { x: 3, y: -3 }]
        }
      ]
    };
    autoBind(this);
    this.refreshData=this.refreshData.bind(this);
  }

  componentDidMount() {
    this.fetchDataSources();
    this.timer = setInterval(this.refreshData, 1000);
  }

  componenWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  fetchDataSources() {
    // eslint-disable-next-line no-console
    console.log('Fetch the data sources.');
    send({
      url: '/data-sources/discover',
      method: 'POST',
      data: { }
    }).then((response) => {
      const dataSources = response.data.dataSources;
      this.props.setDataSources(dataSources);
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch the data sources.', error);
      messages.error(`${ tr('FAILED_TO_FETCH_DATA_SOURCES') } ${ tr(error.message) }`);
    });
  }

  changeDataSource(id) {
    if (!!this.state.dataSource && id === this.state.dataSource.id) {
      return;
    }
    const dataSource = first(this.props.dataSources.filter((ds) => { return ds.id === id; }));
    this.setState({ dataSource });
  }

  refreshData() {
    const data = this.state.data[0];
    data.points = data.points.concat([{ x: data.points.length + 1, y: 10 }]);
    this.setState({
      data: [ data ]
    });
  }

  render() {
    // eslint-disable-next-line no-console
    console.log('Render the data.');
    const dataSources = this.props.dataSources.map((ds) => {
      return { key: ds.id, text: ds.name, value: ds.id };
    });
    return (
      <Container className='data pretty-scroll'>
        <Form>
          <Form.Field inline>
            <label>{ tr('DATA_SOURCE') }</label>
            <Dropdown
              fluid
              selection
              name='dataSource'
              options={ dataSources }
              value={ this.state.dataSource ? this.state.dataSource.id : '' }
              onChange={
                (_e, data) => { this.changeDataSource(data.value); }
              }
            />
          </Form.Field>
        </Form>
        <LineChart
          height={ 400 }
          data={ this.state.data }
        />
      </Container>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
    dataSources: state.dataSources.dataSources
  };
};

const mapDispatchToProps = (dispatch) => {
  const _dataSources = bindActionCreators(dataSources, dispatch);
  return {
    setDataSources: _dataSources.setDataSources
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Data);
