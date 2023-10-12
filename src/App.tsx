import React from 'react';
import Drawer from './modules/formily/drawer';
import Linked from './modules/formily/linked';
import { Tabs } from 'antd';
import './App.less';

function App() {
  return (
    <Tabs centered defaultActiveKey='2'>
      <Tabs.TabPane tab="项目 1" key="1">
        <Drawer />
      </Tabs.TabPane>
      <Tabs.TabPane tab="项目 2" key="2">
        <Linked />
      </Tabs.TabPane>
    </Tabs>
  )
}

export default App;
