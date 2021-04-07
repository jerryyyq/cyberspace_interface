import React from 'react';
import { Layout, Menu, PageHeader } from 'antd';
// import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import ContentTask from './ContentTask.js'
import ContentNode from './ContentNode.js'
import ContentRemote from './ContentRemote.js'
import ContentFinger from './ContentFinger.js'
import ContentStrategy from './ContentStrategy.js'
import ContentPoc from './ContentPoc.js'

import './App.css';

moment.locale('zh-cn');

const { Header, Footer, Sider } = Layout;

class App extends React.Component {
    state = {
        cur_item: 0
    };

    handleClick = event => {
        this.setState({cur_item: event.key});
    }

    render() {
        const CONTENT_ITEMS = [ContentTask, ContentNode, ContentRemote, ContentFinger, ContentStrategy, ContentPoc];
        let CUR_CONTENT = CONTENT_ITEMS[this.state.cur_item]

        return (
            <div className="App">

            <Layout>
                <Layout>
                    <PageHeader avatar={{src:'logo.svg'}} title="网络空间测绘系统" />
                </Layout>

                <Layout>
                    <Sider>
                        <Menu theme="dark" defaultSelectedKeys={['0']}  onClick={this.handleClick} >
                            <Menu.Item key="0">任务管理</Menu.Item>
                            <Menu.Item key="1">节点管理</Menu.Item>
                            <Menu.Item key="2">远程安装</Menu.Item>
                            <Menu.Item key="3">指纹管理</Menu.Item>
                            <Menu.Item key="4">弱口令管理</Menu.Item>
                            <Menu.Item key="5">POC管理</Menu.Item>
                        </Menu>
                    </Sider>

                    <CUR_CONTENT />
                </Layout>

                <Footer>恒安嘉新（北京）科技股份公司 版权所有 © 2008-2021</Footer>
            </Layout>

            </div>
        );
    }
}

export default App;
