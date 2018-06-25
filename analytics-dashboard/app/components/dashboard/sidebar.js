import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import logo from 'extensions/images/logo.png';
import { tr } from 'helpers/languages';

const Sidebar = (props) => {

  // eslint-disable-next-line no-console
  console.log('Render the sidebar.');
  return (
    <Menu vertical className='side'>
      <img className='logo' src={ logo } alt='FAR-EDGE Logo' />
      <Menu.Item
        name='overview'
        active={ props.content === 'overview' }
      >
        <Link to='/dashboard/overview'>
          { tr('OVERVIEW') }
        </Link>
      </Menu.Item>
      <Menu.Item
        name='edge-gateways'
        active={ props.content === 'edge-gateways' }
      >
        <Link to='/dashboard/edge-gateways'>
          { tr('EDGE_GATEWAYS') }
        </Link>
      </Menu.Item>
      <Menu.Item
        name='data-kinds'
        active={ props.content === 'data-kinds' }
      >
        <Link to='/dashboard/data-kinds'>
          { tr('DATA_KINDS') }
        </Link>
      </Menu.Item>
      <Menu.Item
        name='data-interfaces'
        active={ props.content === 'data-interfaces' }
      >
        <Link to='/dashboard/data-interfaces'>
          { tr('DATA_INTERFACES') }
        </Link>
      </Menu.Item>
      <Menu.Item
        name='data-source-definitions'
        active={ props.content === 'data-source-definitions' }
      >
        <Link to='/dashboard/data-source-definitions'>
          { tr('DATA_SOURCE_DEFINITIONS') }
        </Link>
      </Menu.Item>
      <Menu.Item
        name='analytics-processor-definitions'
        active={ props.content === 'analytics-processor-definitions' }
      >
        <Link to='/dashboard/analytics-processor-definitions'>
          { tr('ANALYTICS_PROCESSOR_DEFINITIONS') }
        </Link>
      </Menu.Item>
      <Menu.Item
        name='data-sources'
        active={ props.content === 'data-sources' }
      >
        <Link to='/dashboard/data-sources'>
          { tr('DATA_SOURCES') }
        </Link>
      </Menu.Item>
      <Menu.Item
        name='analytics-instances'
        active={ props.content === 'analytics-instances' }
      >
        <Link to='/dashboard/analytics-instances'>
          { tr('ANALYTICS_INSTANCES') }
        </Link>
      </Menu.Item>
      <Menu.Item
        name='data'
        active={ props.content === 'data' }
      >
        <Link to='/dashboard/data'>
          { tr('DATA') }
        </Link>
      </Menu.Item>
    </Menu>
  );

};

export default Sidebar;
