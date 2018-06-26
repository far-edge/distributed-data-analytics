import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Icon, Menu } from 'semantic-ui-react';

import logo from 'extensions/images/logo.png';
import { tr } from 'helpers/languages';

const Sidebar = (props) => {

  // eslint-disable-next-line no-console
  console.log('Render the sidebar.');
  return (
    <Container className='side'>
      <Menu vertical>
        <img className='logo' src={ logo } alt='FAR-EDGE Logo' />
        <Menu.Item
          name='overview'
          active={ props.content === 'overview' }
        >
          <Link to='/dashboard/overview'>
            <Icon name='sitemap' />
            { tr('OVERVIEW') }
          </Link>
        </Menu.Item>
        <Menu.Item
          name='edge-gateways'
          active={ props.content === 'edge-gateways' }
        >
          <Link to='/dashboard/edge-gateways'>
            <Icon name='building outline' />
            { tr('EDGE_GATEWAYS') }
          </Link>
        </Menu.Item>
      </Menu>
      <Menu vertical>
        <Menu.Item header>{ tr('DATA_DEFINITION') }</Menu.Item>
        <Menu.Item
          name='data-kinds'
          active={ props.content === 'data-kinds' }
        >
          <Link to='/dashboard/data-kinds'>
            <Icon name='file alternate outline' />
            { tr('DATA_KINDS') }
          </Link>
        </Menu.Item>
        <Menu.Item
          name='data-interfaces'
          active={ props.content === 'data-interfaces' }
        >
          <Link to='/dashboard/data-interfaces'>
            <Icon name='file alternate outline' />
            { tr('DATA_INTERFACES') }
          </Link>
        </Menu.Item>
        <Menu.Item
          name='data-source-definitions'
          active={ props.content === 'data-source-definitions' }
        >
          <Link to='/dashboard/data-source-definitions'>
            <Icon name='file alternate outline' />
            { tr('DATA_SOURCE_DEFINITIONS') }
          </Link>
        </Menu.Item>
        <Menu.Item
          name='analytics-processor-definitions'
          active={ props.content === 'analytics-processor-definitions' }
        >
          <Link to='/dashboard/analytics-processor-definitions'>
            <Icon name='file alternate outline' />
            { tr('ANALYTICS_PROCESSOR_DEFINITIONS') }
          </Link>
        </Menu.Item>
      </Menu>
      <Menu vertical>
        <Menu.Item header>{ tr('DATA_ROUTING') }</Menu.Item>
        <Menu.Item
          name='data-sources'
          active={ props.content === 'data-sources' }
        >
          <Link to='/dashboard/data-sources'>
            <Icon name='random' />
            { tr('DATA_SOURCES') }
          </Link>
        </Menu.Item>
      </Menu>
      <Menu vertical>
        <Menu.Item header>{ tr('DATA_ANALYSIS') }</Menu.Item>
        <Menu.Item
          name='analytics-instances'
          active={ props.content === 'analytics-instances' }
        >
          <Link to='/dashboard/analytics-instances'>
            <Icon name='chart line' />
            { tr('ANALYTICS_INSTANCES') }
          </Link>
        </Menu.Item>
      </Menu>
      <Menu vertical>
        <Menu.Item header>{ tr('UTILITIES') }</Menu.Item>
        <Menu.Item
          name='data'
          active={ props.content === 'data' }
        >
          <Link to='/dashboard/data'>
            <Icon name='database' />
            { tr('DATA') }
          </Link>
        </Menu.Item>
      </Menu>
    </Container>
  );

};

export default Sidebar;
