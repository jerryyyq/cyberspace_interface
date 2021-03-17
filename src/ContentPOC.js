import React from 'react';
import { Layout, Table } from 'antd';
import { APP_CONFIG, yyq_fetch } from './public_fun.js';
import DataDetail from './DataDetail.js';
import { CloseCircleOutlined } from '@ant-design/icons';

import './App.css';

class ContentPOC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_page: 0,
            err_msg: "",
            poc_list: []
        };
    }

    fetchAllPocList() {
        let url = APP_CONFIG.DOMAIN_URL + "poc_list";

        yyq_fetch(url, 'GET', 
            (data) => {
                this.setState({
                    poc_list: data.poc_list
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
        this.fetchAllPocList() 
    }
  
    componentWillUnmount() {
    }

    render() {
        const columns = [
            {
              title: '名称',
              dataIndex: 'name',
              key: 'name',
              render: (text, record) => DataDetail(text, record),
            },
            {
              title: '是 POC集',
              dataIndex: 'is_set',
              key: 'is_set',
            },
            {
              title: '说明',
              dataIndex: 'explanation',
              key: 'explanation',
            },
            {
                title: 'md5',
                dataIndex: 'md5',
                key: 'md5',
            },
            {
                title: '更新时间',
                dataIndex: 'update_time',
                key: 'update_time',
            },
            {
                title: '操作员',
                dataIndex: 'operator',
                key: 'operator',
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
                    <h1>POC管理</h1>
                    {this.state.err_msg}
                </Layout.Content>
            );
        } else {
            return (
                <Layout.Content>
                    <h1>POC管理</h1>
                    <Table dataSource={this.state.poc_list} columns={columns} />
                </Layout.Content>
            );
        }

    }
}

export default ContentPOC;