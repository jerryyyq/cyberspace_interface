import React from 'react';
import { Layout, Table, Card, Tooltip, Space } from 'antd';
import { APP_CONFIG, yyq_fetch } from './public_fun.js';
import JsonDetail from './JsonDetail.js';
import WeakPasswordAdd from './WeakPasswordAdd.js';
import { CloseCircleOutlined, ReloadOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';

import './App.css';

class ContentStrategy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_page: 0,
            err_msg: "",
            weak_password_list: [],
            edit_record: null
        };
    }

    fetchAllWeakPasswordList = () => {
        let url = APP_CONFIG.DOMAIN_URL + "weak_password_list";

        yyq_fetch(url, 'GET', 
            (data) => {
                this.setState({
                    weak_password_list: data.weak_password_list
                })

                Array.from(data.weak_password_list, (item, i) => {
                    console.log("item = ", item)
                    this.fetchOneWeakPasswordInfo(item.name)
                })
            }, 
            (err_msg) => {
                this.setState({
                    err_msg: err_msg
                })
            }
        )
    }

    fetchOneWeakPasswordInfo = (name) => {
        let url = APP_CONFIG.DOMAIN_URL + "weak_password/" + name;
        yyq_fetch(url, 'GET', 
        (data) => {
            console.log("data[name] = ", data[name])
            this.setState({
                ['_wp_' + name]: data[name]
            })
        }, 
        (err_msg) => {
            console.log("fetchOneWeakPasswordInfo(" + name + "), err_msg = ", err_msg)
            this.setState({
                err_msg: err_msg
            })
        })
    }

    onWeakPasswordAddChange = (cancel_edit) => {
        if(cancel_edit) {
            this.setState({edit_record:null})
        } else {
            this.fetchAllWeakPasswordList()
        }
    }

    onDeleteStrategy = (id, e) => {
        console.log("onDeleteStrategy, id = ", id, ", e = ", e)
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
                alert("删除失败！err_msg = ", err_msg)
            }
        )
    }

    componentDidMount() {
        this.fetchAllWeakPasswordList() 
    }
  
    componentWillUnmount() {
    }

    render() {
        const columns = [
            {
              title: '名称',
              dataIndex: 'name',
              key: 'name',
              render: (text, record) => JsonDetail(text, this.state["_wp_" + text]),
            },
            {
                title: 'md5',
                dataIndex: 'md5',
                key: 'md5',
            },
            {
                title: '更新时间',
                dataIndex: 'modify_time',
                key: 'modify_time',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <Space>
                    <a onClick={e => {this.onDeleteStrategy(record.id, e)}}><Tooltip title='删除'><CloseCircleOutlined style={{ color: 'hotpink' }} /></Tooltip></a>
                    <a onClick={e => {this.onEditFinger(record, e)}}><Tooltip title='修改'><EditOutlined style={{ color: 'orange' }} /></Tooltip></a>
                    <a href={APP_CONFIG.DOMAIN_URL + "finger_download/" + record.finger_zip_file}><Tooltip title='下载'><DownloadOutlined style={{ color: 'deepskyblue' }} /></Tooltip></a>
                    </Space>
                ),
            },
        ];


        if(this.state.err_msg !== "") {
            return (
                <Layout.Content>
                    <h1>弱口令管理</h1>
                    {this.state.err_msg}
                </Layout.Content>
            );
        } else {
            return (
                <Layout.Content>
                    <h2>弱口令管理</h2>
                    <div className="Content">
                    <WeakPasswordAdd edit_record={this.state.edit_record} onChange={this.onWeakPasswordAddChange} /><br />

                    <Card title="弱口令模板列表" extra={<ReloadOutlined style={{ color: 'blue' }} onClick={this.fetchAllWeakPasswordList}/>}>
                    <Table dataSource={this.state.weak_password_list} columns={columns} />
                    </Card>
                    </div>
                </Layout.Content>
            );
        }

    }
}

export default ContentStrategy;