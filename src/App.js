import React from 'react';
import { Layout, Menu, PageHeader } from 'antd';
// import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import ContentTask from './ContentTask.js'
import ContentRemote from './ContentRemote.js'
import ContentFinger from './ContentFinger.js'
import ContentStrategy from './ContentStrategy.js'
import ContentPoc from './ContentPoc.js'
import ContentLogon from './ContentLogon.js'
import ContentNode from './ContentNode.js'
import ContentNodeStatistics from './ContentNodeStatistics.js'
import ContentFofaSearch from './ContentFofaSearch.js'
import ContentPassword from './ContentPassword.js'

import './App.css';

moment.locale('zh-cn');

const { Footer, Sider } = Layout;

class App extends React.Component {
    state = {
        logon: 0,
        user_name: "",
        cur_item: 0
    };

    handleLogon = (logon, user_name) => {
        this.setState({logon: logon, user_name: user_name});
    }

    handleClick = event => {
        if(parseInt(event.key) === 7) {
            window.open(window.location.href + "search");
            return
        }

        this.setState({cur_item: event.key});
    }

    render() {
        // 未登录
        if(0 === this.state.logon) {
            return (
                <Layout>
                    <Layout>
                        <PageHeader avatar={{src:'logo.svg'}} title="网络空间测绘系统" />
                    </Layout>

                    <ContentLogon onLogon={this.handleLogon} />
                    
                    <Footer style={{ textAlign: 'center' }}>恒安嘉新（北京）科技股份公司 版权所有 © 2008-2021</Footer>
                </Layout>
            )
        }

        // 已经登录成功：
        const CONTENT_ITEMS = [ContentTask, ContentRemote, ContentFinger, ContentStrategy, 
                ContentPoc, ContentNode, ContentNodeStatistics, ContentFofaSearch, ContentPassword];
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
                            <Menu.Item key="1">远程安装</Menu.Item>
                            <Menu.Item key="2">指纹管理</Menu.Item>
                            <Menu.Item key="3">弱口令管理</Menu.Item>
                            <Menu.Item key="4">POC管理</Menu.Item>
                            <Menu.Item key="5">节点管理</Menu.Item>
                            <Menu.Item key="6">节点子任务</Menu.Item>
                            <Menu.Item key="7">数据检索</Menu.Item>
                            <Menu.Item key="8">修改口令</Menu.Item>
                        </Menu>
                    </Sider>

                    <CUR_CONTENT user={this.state.user_name}/>
                </Layout>

                <Footer>恒安嘉新（北京）科技股份公司 版权所有 © 2008-2021</Footer>
            </Layout>

            </div>
        );
    }
}

export default App;
