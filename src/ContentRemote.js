import React from 'react';
import { Layout, Table, Card, Tooltip, Space } from 'antd';
import { APP_CONFIG, yyq_fetch, get_local_stroage_value, set_local_stroage_value } from './public_fun.js';
import DataDetail from './DataDetail.js';
import RemoteAdd from './RemoteAdd.js';
import { CloseCircleOutlined, ReloadOutlined, EditOutlined, CaretRightOutlined } from '@ant-design/icons';

import './App.css';

const { Content } = Layout;

const KEY_NAME_REMOTE_LIST = "_ls_remote_list"

class ContentRemote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_page: 0,
            err_msg: "",
            remote_list: [],
            edit_record: null,
            add_expand: false
        };
    }

    fetchAllRemoteList = () => {
        let url = APP_CONFIG.DOMAIN_URL + "remote_list";

        yyq_fetch(url, 'GET', 
            (data) => {
                let new_remote_list = data.remote_list.map(function(item){
                    item["password"] = window.atob(item["password"]) 
                    return item;
                })

                this.setState({
                    remote_list: new_remote_list,
                    edit_record: null,
                    add_expand: false
                })

                set_local_stroage_value(KEY_NAME_REMOTE_LIST, new_remote_list)
            }, 
            (err_msg) => {
                this.setState({
                    err_msg: err_msg
                })
            }
        )
    }

    onRemoteAddChange = (cancel_edit) => {
        if(!cancel_edit) {
            this.fetchAllRemoteList()
        }

        this.setState({edit_record:null, add_expand:false})
    }

    onDeleteRemote = (id, e) => {
        console.log("onDeleteRemote, id = ", id, ", e = ", e)
        let url = APP_CONFIG.DOMAIN_URL + "remote_machine/" + id;

        yyq_fetch(url, 'DELETE', 
            (data) => {
                let new_remote_list = this.state.remote_list.filter(function(item) {
                    return item["id"] !== id;
                })

                this.setState({
                    remote_list: new_remote_list
                })

                set_local_stroage_value(KEY_NAME_REMOTE_LIST, new_remote_list)
            }, 
            (err_msg) => {
                alert("删除失败！err_msg = " + err_msg)
            }
        )
    }

    onEditRemote = (record, e) => {
        console.log("onEditRemote,record = ", record, ", e = ", e)
        this.setState({edit_record:record, add_expand:true})
    }

    onExecuteInstall = (record, e) => {
        console.log("onExecuteInstall,record = ", record, ", e = ", e)

        let fetch_data = {"id": record.id, "install_step": record.install_step}

        let url = APP_CONFIG.DOMAIN_URL + "remote_install_execute";

        yyq_fetch(url, 'POST', 
            (data) => {
                alert("正在执行远程安装，请稍后刷新列表查看进度")
                let new_remote_list = data.remote_list.map(function(item){
                    if (item.id === record.id) {
                        item["install_state"] = 1
                    }

                    return item;
                })

                this.setState({
                    remote_list: new_remote_list
                })

                set_local_stroage_value(KEY_NAME_REMOTE_LIST, new_remote_list)
            }, 
            (err_msg) => {
                alert("远程安装失败！err_msg = " + err_msg)
            },
            fetch_data
        )
    }

    componentDidMount() {
        let ls_value = get_local_stroage_value(KEY_NAME_REMOTE_LIST)
        if(ls_value === null) {
            this.fetchAllRemoteList()
        } else {
            this.setState({remote_list: ls_value})
        }
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
                    <Space>
                    <a onClick={e => {this.onDeleteRemote(record.id, e)}}><Tooltip title='删除'><CloseCircleOutlined style={{ color: 'hotpink' }} /></Tooltip></a>
                    <a onClick={e => {this.onEditRemote(record, e)}}><Tooltip title='修改'><EditOutlined style={{ color: 'orange' }} /></Tooltip></a>
                    <a onClick={e => {this.onExecuteInstall(record, e)}}><Tooltip title='安装'><CaretRightOutlined style={{ color: 'limegreen' }} /></Tooltip></a>
                    </Space>
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
                <Content>
                    <h2>远程安装管理</h2>
                    <div className="Content">
                    <RemoteAdd edit_record={this.state.edit_record} expand={this.state.add_expand} onChange={this.onRemoteAddChange} /><br />

                    <Card title="远程机器列表" extra={<ReloadOutlined style={{ color: 'blue' }} onClick={this.fetchAllRemoteList}/>}>
                    <Table dataSource={this.state.remote_list} columns={columns} />
                    </Card>
                    </div>
                </Content>
            );
        }

    }
}

export default ContentRemote;