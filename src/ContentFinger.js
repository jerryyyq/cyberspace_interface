import React from 'react';
import { Layout, Table } from 'antd';
import { APP_CONFIG, yyq_fetch } from './public_fun.js';
import { CloseCircleOutlined } from '@ant-design/icons';

import './App.css';

class ContentFinger extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_page: 0,
            err_msg: "",
            finger_list: []
        };
    }

    fetchAllFingerList() {
        let url = APP_CONFIG.DOMAIN_URL + "finger_list";

        yyq_fetch(url, 'GET', 
            (data) => {
                this.setState({
                    finger_list: data.finger_list
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
        this.fetchAllFingerList() 
    }
  
    componentWillUnmount() {
    }

    render() {
        const columns = [
            {
                title: '索引',
                dataIndex: 'id',
                key: 'id',
                render: text => <a href="javascript:void(0)">{text}</a>,
            },
            {
              title: '名称',
              dataIndex: 'finger_name',
              key: 'finger_name',
              render: text => <a>{text}</a>,
            },
            {
              title: '文件名',
              dataIndex: 'finger_zip_file',
              key: 'finger_zip_file',
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
                    <h1>指纹管理</h1>
                    {this.state.err_msg}
                </Layout.Content>
            );
        } else {
            return (
                <Layout.Content>
                    <h1>指纹管理</h1>
                    <Table dataSource={this.state.finger_list} columns={columns} />
                </Layout.Content>
            );
        }

    }
}

export default ContentFinger;