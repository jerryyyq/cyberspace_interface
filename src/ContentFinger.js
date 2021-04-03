import React from 'react';
import { Layout, Table, Card, Tooltip, Space } from 'antd';
import { APP_CONFIG, yyq_fetch } from './public_fun.js';
import DataDetail from './DataDetail.js';
import FingerAdd from './FingerAdd.js';
import { CloseCircleOutlined, ReloadOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';

import './App.css';

class ContentFinger extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_page: 0,
            err_msg: "",
            finger_list: [],
            edit_record: null
        };
    }

    fetchAllFingerList = () => {
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

    onFingerAddChange = (cancel_edit) => {
        if(!cancel_edit) {
            this.fetchAllFingerList()
        }

        this.setState({edit_record:null})
    }

    onDeleteFinger = (id, e) => {
        console.log("onDeleteFinger, id = ", id, ", e = ", e)
        let url = APP_CONFIG.DOMAIN_URL + "finger/" + id;

        yyq_fetch(url, 'DELETE', 
            (data) => {
                this.setState({
                    finger_list: this.state.finger_list.filter(function(item) {
                        return item["id"] !== id;
                    })
                })
            }, 
            (err_msg) => {
                alert("删除失败！err_msg = " + err_msg)
            }
        )
    }

    onEditFinger = (record, e) => {
        console.log("onEditFinger, record = ", record, ", e = ", e)
        this.setState({edit_record:record})
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
                render: (text, record) => DataDetail(text, record),
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
                    <Space>
                    <a onClick={e => {this.onDeleteFinger(record.id, e)}}><Tooltip title='删除'><CloseCircleOutlined style={{ color: 'hotpink' }} /></Tooltip></a>
                    <a onClick={e => {this.onEditFinger(record, e)}}><Tooltip title='修改'><EditOutlined style={{ color: 'orange' }} /></Tooltip></a>
                    <a href={APP_CONFIG.DOMAIN_URL + "finger_download/" + record.finger_zip_file}><Tooltip title='下载'><DownloadOutlined style={{ color: 'deepskyblue' }} /></Tooltip></a>
                    </Space>
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
                    <h2>指纹管理</h2>
                    <div className="Content">
                    <FingerAdd edit_record={this.state.edit_record} onChange={this.onFingerAddChange} /><br />

                    <Card title="指纹列表" extra={<ReloadOutlined style={{ color: 'blue' }} onClick={this.fetchAllFingerList}/>}>
                    <Table dataSource={this.state.finger_list} columns={columns} />
                    </Card>
                    </div>
                </Layout.Content>
            );
        }

    }
}

export default ContentFinger;