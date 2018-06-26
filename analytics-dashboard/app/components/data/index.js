import moment from 'moment';
import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { LineChart } from 'react-easy-chart';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Dropdown, Form, Message } from 'semantic-ui-react';

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
      data: [ ],
      componentWidth: 300
    };
    this.INTERVAL = 15000;
    this.NUMBER_OF_VALUES = 30;
    autoBind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.fetchDataSources();
    if (this.state.dataSource) {
      this.timer = setInterval(this.fetchData, this.INTERVAL);
    }
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componenWillUnmount() {
    // NOTE: The component never gets unmounted. So, there is definitely something I need to fix.
    if (this.timer) {
      clearInterval(this.timer);
    }
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    if (this.container) {
      this.setState({
        componentWidth: this.container.offsetWidth - 60
      });
    }
  }

  fetchDataSources() {
    // eslint-disable-next-line no-console
    console.log('Fetch the data sources.');
    send({
      url: `${ process.env.OPEN_API_FOR_ANALYTICS_BASE_URL }/data-sources/discover`,
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
    // The data source was not changed.
    if (!!this.state.dataSource && id === this.state.dataSource.id) {
      return;
    }
    const dataSource = first(this.props.dataSources.filter((ds) => { return ds.id === id; }));
    const noDataSourceBefore = dataSource && !this.state.dataSource;
    this.setState({ dataSource, data: [] }, () => {
      if (noDataSourceBefore) {
        this.timer = setInterval(this.fetchData, this.INTERVAL);
        this.handleResize();
      }
    });
  }

  fetchData() {
    const dataSource = this.state.dataSource;
    if (!dataSource) {
      return;
    }
    // NOTE: This is what I need to fix.
    if (!this.container && this.timer) {
      clearInterval(this.timer);
    }
    // eslint-disable-next-line no-console
    console.log('Fetch the data.');
    const query = dataSource.edgeGatewayReferenceID ? `?edgeGatewayReferenceID=${ dataSource.edgeGatewayReferenceID }` :
      '';
    send({
      url: `${ process.env.OPEN_API_FOR_ANALYTICS_BASE_URL }/data-sources/${ dataSource.id }/data${ query }`,
      method: 'GET'
    }).then((response) => {
      // Nothing to show data to any more.
      if (!this.container) {
        return null;
      }
      const latest = this.state.data && this.state.data.length ?
        moment(this.state.data[this.state.data.length - 1].x, 'D-MMM-YY HH:mm:ss') : null;
      const moreData = response.data.data.filter((d) => {
        return !latest || moment(d.timestamp, 'D-MMM-YY HH:mm:ss').isAfter(latest);
      }).map((d) => {
        return { x: d.timestamp, y: parseInt(d.value) };
      });
      const data = [ ...this.state.data ].concat(moreData);
      while (data.length > this.NUMBER_OF_VALUES) {
        data.shift();
      }
      this.setState({ data });
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch the data.', error);
      messages.error(`${ tr('FAILED_TO_FETCH_DATA') } ${ tr(error.message) }`);
    });

  }

  render() {
    // eslint-disable-next-line no-console
    console.log('Render the data.');
    const dataSources = this.props.dataSources.map((ds) => {
      return { key: ds.id, text: ds.name, value: ds.id };
    });
    const min = this.state.data.reduce((acc, d) => {
      return d.y < acc ? d.y : acc;
    }, this.state.data && this.state.data.length ? this.state.data[0].y : 0);
    const max = this.state.data.reduce((acc, d) => {
      return d.y > acc ? d.y : acc;
    }, this.state.data && this.state.data.length ? this.state.data[0].y : 0);
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
        {
          this.state.dataSource ? (
            <div ref={ (c) => { this.container = c; } }>
              <LineChart
                className='chart'
                margin={ { top: 40, right: 40, bottom: 50, left: 50 } }
                data={ [ this.state.data ] }
                datePattern='%d-%b-%y %H:%M:%S'
                xType='time'
                width={ this.state.componentWidth }
                height={ 400 }
                interpolate='cardinal'
                yDomainRange={ [ min - 2, max + 2 ] }
                axes
                grid
                verticalGrid
                style={
                  {
                    '.line0': {
                      stroke: 'green'
                    }
                  }
                }
              />
            </div>
          ) : (
            <Message>{ tr('NO_DATA') }</Message>
          )
        }
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
