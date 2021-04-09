import React from 'react';
import { Layout, Table, Card, Tooltip, Space } from 'antd';
import { APP_CONFIG, yyq_fetch, get_local_stroage_value, set_local_stroage_value } from './public_fun.js';
import DataDetail from './DataDetail.js';
import TaskAdd from './TaskAdd.js';
import { CloseCircleOutlined, ReloadOutlined, ProfileOutlined } from '@ant-design/icons';

import './App.css';

const { Content } = Layout;

const KEY_NAME_TASK_LIST = "_ls_task_list"
const KEY_NAME_WEAK_PASSWORD_LIST = "_ls_weak_password_list"
const KEY_NAME_POC_LIST = "_ls_poc_list"

class ContentTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_page: 0,
            err_msg: "",
            task_list: [],
            weak_password_list: [],
            poc_list: []
        };
    }

    fetchAllTaskList = () => {
        let url = APP_CONFIG.DOMAIN_URL + "task_list";

        yyq_fetch(url, 'GET', 
            (data) => {
                this.setState({
                    task_list: data.task_list
                })

                set_local_stroage_value(KEY_NAME_TASK_LIST, data.task_list)
            }, 
            (err_msg) => {
                this.setState({
                    err_msg: err_msg
                })
            }
        )
    }

    fetchAllWeakPasswordList = () => {
        let url = APP_CONFIG.DOMAIN_URL + "weak_password_list";

        yyq_fetch(url, 'GET', 
            (data) => {
                this.setState({
                    weak_password_list: data.weak_password_list
                })

                set_local_stroage_value(KEY_NAME_WEAK_PASSWORD_LIST, data.weak_password_list)
            }, 
            (err_msg) => {
                this.setState({
                    err_msg: err_msg
                })
            }
        )
    }

    fetchAllPocList = () => {
        let url = APP_CONFIG.DOMAIN_URL + "poc_list";

        yyq_fetch(url, 'GET', 
            (data) => {
                this.setState({
                    poc_list: data.poc_list
                })

                set_local_stroage_value(KEY_NAME_POC_LIST, data.poc_list)
            }, 
            (err_msg) => {
                this.setState({
                    err_msg: err_msg
                })
            }
        )
    }

    onDeleteTask = (task_id, e) => {
        console.log("onDeleteTask, task_id = ", task_id, ", e = ", e)
        let url = APP_CONFIG.DOMAIN_URL + "scan_task/" + task_id;

        yyq_fetch(url, 'DELETE', 
            (data) => {
                let new_task_list = this.state.task_list.filter(function(item) {
                    return item["task_id"] !== task_id;
                })

                this.setState({
                    task_list: new_task_list
                })

                set_local_stroage_value(KEY_NAME_TASK_LIST, new_task_list)
            }, 
            (err_msg) => {
                alert("删除失败！err_msg = " + err_msg)
            }
        )
    }

    onShowResult = (task_id, e) => {
        console.log("onShowResult, task_id = ", task_id)
    }

    componentDidMount() {
        let ls_value = get_local_stroage_value(KEY_NAME_TASK_LIST)
        if(ls_value === null) {
            this.fetchAllTaskList()
        } else {
            this.setState({task_list: ls_value})
        }

        ls_value = get_local_stroage_value(KEY_NAME_WEAK_PASSWORD_LIST)
        if(ls_value === null) {
            this.fetchAllWeakPasswordList()
        } else {
            this.setState({weak_password_list: ls_value})
        }

        ls_value = get_local_stroage_value(KEY_NAME_POC_LIST)
        if(ls_value === null) {
            this.fetchAllPocList()
        } else {
            this.setState({poc_list: ls_value})
        }
    }
  
    componentWillUnmount() {
    }

    render() {
        let SHOW_RESULT


        const columns = [
            {
                title: '任务 ID',
                dataIndex: 'task_id',
                key: 'task_id',
                render: (text, record) => DataDetail(text, record),
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
                render: (text, record) => {
                    if (2 === record.data_state) {
                        return (
                            <Space>
                            <a onClick={e => {this.onDeleteTask(record.task_id, e)}}><Tooltip title='删除'><CloseCircleOutlined style={{ color: 'hotpink' }} /></Tooltip></a>
                            <a onClick={e => {this.onShowResult(record.task_id, e)}}><Tooltip title='查看结果'><ProfileOutlined style={{ color: 'green' }} /></Tooltip></a>
                            </Space>
                        )
                    } else {
                        return (
                            <a onClick={e => {this.onDeleteTask(record.task_id, e)}}><Tooltip title='删除'><CloseCircleOutlined style={{ color: 'hotpink' }} /></Tooltip></a>
                        )
                    }
                }
            },
        ];

        // alert(this.state.task_list);

        if(this.state.err_msg !== "") {
            return (
                <Content>
                    <h1>任务管理</h1>
                    {this.state.err_msg}
                </Content>
            );
        } else {
            return (
                <Content>
                    <h2>任务管理</h2>
                    <div className="Content">
                    <TaskAdd refresh_list={this.fetchAllTaskList} strategy={this.state.weak_password_list} poc={this.state.poc_list} /><br />

                    <Card title="任务列表" extra={<ReloadOutlined style={{ color: 'blue' }} onClick={this.fetchAllTaskList}/>}>
                    <Table dataSource={this.state.task_list} columns={columns} />
                    </Card>
                    </div>
                </Content>
            );
        }

    }
}

export default ContentTask;