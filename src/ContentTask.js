import React from 'react';
import { Layout, Table } from 'antd';
import { APP_CONFIG, yyq_fetch } from './publid_fun.js';
import { CloseCircleOutlined } from '@ant-design/icons';

import './App.css';

class ContentTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_page: 0,
            err_msg: "",
            task_list: []
        };
    }

    fetchAllTaskList() {
        let url = APP_CONFIG.DOMAIN_URL + "task_list";

        yyq_fetch(url, 'GET', 
            (data) => {
                this.setState({
                    task_list: data.task_list
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
        this.fetchAllTaskList() 
    }
  
    componentWillUnmount() {
    }

    render() {
        const columns = [
            {
              title: '任务 ID',
              dataIndex: 'task_id',
              key: 'task_id',
              render: text => <a>{text}</a>,
            },
            {
              title: '名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '优先级',
              dataIndex: 'priority',
              key: 'priority',
            },
            {
                title: '扫描类型',
                dataIndex: 'scan_type',
                key: 'scan_type',
            },
            {
                title: '策略',
                dataIndex: 'strategy',
                key: 'strategy',
            },
            {
                title: '任务状态',
                dataIndex: 'task_state',
                key: 'task_state',
            },
            {
                title: '数据状态',
                dataIndex: 'data_state',
                key: 'data_state',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                key: 'create_time',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <a onClick={this.handleDeleteTask}> <CloseCircleOutlined style={{ color: 'hotpink' }} /> </a>
                ),
            },
        ];

        // alert(this.state.task_list);

        if(this.state.err_msg !== "") {
            return (
                <Layout.Content>
                    <h1>任务管理</h1>
                    {this.state.err_msg}
                </Layout.Content>
            );
        } else {
            return (
                <Layout.Content>
                    <h1>任务管理</h1>
                    <Table dataSource={this.state.task_list} columns={columns} />
                </Layout.Content>
            );
        }

    }
}

export default ContentTask;