import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Container, Grid, Segment } from 'semantic-ui-react';

import AnalyticsInstances from 'components/analytics-instances';
import AnalyticsProcessorDefinitions from 'components/analytics-processor-definitions';
import DataInterfaces from 'components/data-interfaces';
import DataKinds from 'components/data-kinds';
import DataSourceDefinitions from 'components/data-source-definitions';
import DataSources from 'components/data-sources';
import EdgeGateways from 'components/edge-gateways';
import Overview from 'components/overview';
import Sidebar from 'components/dashboard/sidebar';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    const path = props.location.pathname;
    const pieces = path.split('/');
    const content = pieces[pieces.length - 1];
    this.state = {
      content
    };
    autoBind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      const path = nextProps.location.pathname;
      const pieces = path.split('/');
      const content = pieces[pieces.length - 1];
      this.setState({ content });
    }
  }

  render() {
    // eslint-disable-next-line no-console
    console.log('Render the dashboard.');
    return (
      <Container fluid className='dashboard'>
        <Grid container className='body'>
          <Grid.Column width={ 3 }>
            <Sidebar
              content={ this.state.content }
            />
          </Grid.Column>
          <Grid.Column width={ 13 }>
            <Segment basic className='content'>
              <Route
                path='/dashboard/overview'
                render={ (routeProps) => { return ( <Overview { ...routeProps } /> ); } }
              />
              <Route
                path='/dashboard/edge-gateways'
                render={ (routeProps) => { return ( <EdgeGateways { ...routeProps } /> ); } }
              />
              <Route
                path='/dashboard/data-kinds'
                render={ (routeProps) => { return ( <DataKinds { ...routeProps } /> ); } }
              />
              <Route
                path='/dashboard/data-interfaces'
                render={ (routeProps) => { return ( <DataInterfaces { ...routeProps } /> ); } }
              />
              <Route
                path='/dashboard/data-source-definitions'
                render={ (routeProps) => { return ( <DataSourceDefinitions { ...routeProps } /> ); } }
              />
              <Route
                path='/dashboard/analytics-processor-definitions'
                render={ (routeProps) => { return ( <AnalyticsProcessorDefinitions { ...routeProps } /> ); } }
              />
              <Route
                path='/dashboard/data-sources'
                render={ (routeProps) => { return ( <DataSources { ...routeProps } /> ); } }
              />
              <Route
                path='/dashboard/analytics-instances'
                render={ (routeProps) => { return ( <AnalyticsInstances { ...routeProps } /> ); } }
              />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }

}

const mapStateToProps = (_state) => {
  return { };
};

const mapDispatchToProps = (_dispatch) => {
  return { };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
