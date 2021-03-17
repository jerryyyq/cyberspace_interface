import React from 'react';
import { Layout, Table } from 'antd';
import { APP_CONFIG, yyq_fetch } from './public_fun.js';
import DataDetail from './DataDetail.js';
import { CloseCircleOutlined } from '@ant-design/icons';

import './App.css';

class ContentRemote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_page: 0,
            err_msg: "",
            remote_list: []
        };
    }

    fetchAllRemoteList() {
        let url = APP_CONFIG.DOMAIN_URL + "remote_list";

        yyq_fetch(url, 'GET', 
            (data) => {
                this.setState({
                    remote_list: data.remote_list
                })
            }, 
            (err_msg) => {
                this.setState({
                    err_msg: err_msg
                })
            }
        )
    }

    handleDeleteTask(event) {

    }

    componentDidMount() {
        this.fetchAllRemoteList() 
    }
  
    componentWillUnmount() {
    }

    render() {
        const columns = [
            {
              title: '索引',
              dataIndex: 'id',
              key: 'id',
              render: (text, record) => DataDetail(text, record),
            },
            {
              title: 'IP',
              dataIndex: 'ip',
              key: 'ip',
            },
            {
                title: 'ssh 端口号',
                dataIndex: 'ssh_port',
                key: 'ssh_port',
            },
            {
                title: '用户名',
                dataIndex: 'user_name',
                key: 'user_name',
            },
            {
                title: '口令',
                dataIndex: 'password',
                key: 'password',
            },
            {
                title: '说明',
                dataIndex: 'explanation',
                key: 'explanation',
            },
            {
                title: '预置节点 ID',
                dataIndex: 'preset_node_id',
                key: 'preset_node_id',
            },
            {
                title: '中心 IP',
                dataIndex: 'center_ip',
                key: 'center_ip',
            },
            {
                title: '中心 API 端口',
                dataIndex: 'center_api_port',
                key: 'center_api_port',
            },
            {
                title: '中心数据端口',
                dataIndex: 'center_data_port',
                key: 'center_data_port',
            },
            {
                title: '安装状态',
                dataIndex: 'install_state',
                key: 'install_state',
            },
            {
                title: '安装进度',
                dataIndex: 'install_step',
                key: 'install_step',
            },
            {
                title: '安装时间',
                dataIndex: 'install_time',
                key: 'install_time',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <a onClick={this.handleDeleteTask}> <CloseCircleOutlined style={{ color: 'hotpink' }} /> </a>
                ),
            },
        ];


        if(this.state.err_msg !== "") {
            return (
                <Layout.Content>
                    <h1>远程安装</h1>
                    {this.state.err_msg}
                </Layout.Content>
            );
        } else {
            return (
                <Layout.Content>
                    <h1>远程安装</h1>
                    <Table dataSource={this.state.remote_list} columns={columns} />
                </Layout.Content>
            );
        }

    }
}

export default ContentRemote;