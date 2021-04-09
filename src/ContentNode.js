import React from 'react';
import { Layout, Table, Card, Tooltip } from 'antd';
import { APP_CONFIG, yyq_fetch, get_local_stroage_value, set_local_stroage_value } from './public_fun.js';
import DataDetail from './DataDetail.js';
import { CloseCircleOutlined, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';

import './App.css';

const KEY_NAME_NODE_LIST = "_ls_node_list"

class ContentNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_page: 0,
            err_msg: "",
            node_list: []
        };
    }

    fetchAllNodeList = () => {
        let url = APP_CONFIG.DOMAIN_URL + "node_list";

        yyq_fetch(url, 'GET', 
            (data) => {
                this.setState({
                    node_list: data.node_list
                })

                set_local_stroage_value(KEY_NAME_NODE_LIST, data.node_list)
            }, 
            (err_msg) => {
                this.setState({
                    err_msg: err_msg
                })
            }
        )
    }

    onEnableNode = (node_id, enable) => {
        console.log("onEnableNode, node_id = ", node_id, ", enable = ", enable)
        let url = APP_CONFIG.DOMAIN_URL + "node_enable";

        yyq_fetch(url, 'PUT', 
            (data) => {
                let new_node_list = this.state.node_list.map(function(item) {
                    if (item["node_id"] === node_id)
                        item["enable"] = enable 
                    return item;
                })

                this.setState({
                    node_list: new_node_list
                })

                set_local_stroage_value(KEY_NAME_NODE_LIST, new_node_list)
            }, 
            (err_msg) => {
                alert(err_msg)
            },
            JSON.stringify({"node_id":node_id, "enable":enable})
        )
    }

    componentDidMount() {
        let ls_value = get_local_stroage_value(KEY_NAME_NODE_LIST)
        if(ls_value === null) {
            this.fetchAllNodeList()
        } else {
            this.setState({node_list: ls_value})
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
              title: '节点 ID',
              dataIndex: 'node_id',
              key: 'node_id',
            },
            {
              title: '节点 IP',
              dataIndex: 'node_ip',
              key: 'node_ip',
            },
            {
                title: '使能',
                dataIndex: 'enable',
                key: 'enable',
            },
            {
                title: '任务 ID',
                dataIndex: 'task_id',
                key: 'task_id',
            },
            {
                title: '任务名称',
                dataIndex: 'task_name',
                key: 'task_name',
            },
            {
                title: 'IP 分组索引',
                dataIndex: 'ip_group_id',
                key: 'ip_group_id',
            },
            {
                title: '子任务序号',
                dataIndex: 'sub_task_id',
                key: 'sub_task_id',
            },
            {
                title: '已离线',
                dataIndex: 'is_died',
                key: 'is_died',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                key: 'create_time',
            },
            {
                title: '最后心跳',
                dataIndex: 'heart_time',
                key: 'heart_time',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    if (record.enable) return (<a onClick={e => {this.onEnableNode(record.node_id, 0)}}><Tooltip title='禁用'><CloseCircleOutlined style={{ color: 'hotpink' }} /></Tooltip></a>)
                    else return (<a onClick={e => {this.onEnableNode(record.node_id, 1)}}><Tooltip title='启用'><CheckCircleOutlined style={{ color: 'green' }} /></Tooltip></a>)   
                }
            },
        ];


        if(this.state.err_msg !== "") {
            return (
                <Layout.Content key="1">
                    <h1>节点管理</h1>
                    {this.state.err_msg}
                </Layout.Content>
            );
        } else {
            return (
                <Layout.Content key="1">
                    <h2>节点管理</h2>
                    <div className="Content">
                    <Card title="节点列表" extra={<ReloadOutlined style={{ color: 'blue' }} onClick={this.fetchAllNodeList}/>}>
                    <Table dataSource={this.state.node_list} columns={columns} />
                    </Card>
                    </div>
                </Layout.Content>
            );
        }

    }
}

export default ContentNode;