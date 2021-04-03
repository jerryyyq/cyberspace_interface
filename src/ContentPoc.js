import React from 'react';
import { Layout, Table, Card, Tooltip, Space } from 'antd';
import { APP_CONFIG, yyq_fetch } from './public_fun.js';
import DataDetail from './DataDetail.js';
import PocAdd from './PocAdd.js';
import { CloseCircleOutlined, ReloadOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';

import './App.css';

class ContentPoc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_page: 0,
            err_msg: "",
            poc_list: [],
            edit_record: null
        };
    }

    fetchAllPocList = () => {
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

    onPocAddChange = (cancel_edit) => {
        if(!cancel_edit) {
            this.fetchAllPocList()
        } 
        
        this.setState({edit_record:null})
    }

    onDeletePoc = (name, e) => {
        console.log("onDeletePOC, name = ", name, ", e = ", e)
        let url = APP_CONFIG.DOMAIN_URL + "poc/" + name;

        yyq_fetch(url, 'DELETE', 
            (data) => {
                this.setState({
                    poc_list: this.state.poc_list.filter(function(item) {
                        return item["name"] !== name;
                    })
                })
            }, 
            (err_msg) => {
                alert("删除失败！err_msg = " + err_msg)
            }
        )
    }

    onEditPoc = (record, e) => {
        console.log("onEditPOC, record = ", record, ", e = ", e)
        this.setState({edit_record:record})
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
              render: (text) => (text == 1 ? "是" : "否")
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
                    <Space>
                    <a onClick={e => {this.onDeletePoc(record.name, e)}}><Tooltip title='删除'><CloseCircleOutlined style={{ color: 'hotpink' }} /></Tooltip></a>
                    <a onClick={e => {this.onEditPoc(record, e)}}><Tooltip title='修改'><EditOutlined style={{ color: 'orange' }} /></Tooltip></a>
                    <a href={APP_CONFIG.DOMAIN_URL + "poc_download/" + record.name}><Tooltip title='下载'><DownloadOutlined style={{ color: 'deepskyblue' }} /></Tooltip></a>
                    </Space>
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
                    <h2>POC管理</h2>
                    <div className="Content">
                    <PocAdd edit_record={this.state.edit_record} onChange={this.onPocAddChange} /><br />

                    <Card title="POC列表" extra={<ReloadOutlined style={{ color: 'blue' }} onClick={this.fetchAllPocList}/>}>
                    <Table dataSource={this.state.poc_list} columns={columns} />
                    </Card>
                    </div>
                </Layout.Content>
            );
        }

    }
}

export default ContentPoc;