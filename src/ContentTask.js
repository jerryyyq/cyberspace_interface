import React from 'react';
import { Layout, Table, Card, Tooltip, Space, PageHeader, Row, Col } from 'antd';
import { APP_CONFIG, yyq_fetch, get_local_stroage_value, set_local_stroage_value } from './public_fun.js';
import DataDetail from './DataDetail.js';
import TaskAdd from './TaskAdd.js';
import ShowResult from './ShowResult.js';
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
            poc_list: [],
            show_result: null
        };
    }

    reloadAllList = () => {
        this.fetchAllWeakPasswordList()

        this.fetchAllPocList()

        this.fetchAllTaskList()
    }

    fetchAllTaskList = () => {
        let url = APP_CONFIG.DOMAIN_URL + "task_list";

        yyq_fetch(url, 'GET', 
            (data) => {
                this.setState({
                    task_list: data.task_list
                })

                set_local_stroage_value(KEY_NAME_TASK_LIST, data.task_list)

                for(let i = 0; i < data.task_list.length; i++) {
                    if(data.task_list[i].scan_type === "4") {
                        this.fetchOneTaskPocList(data.task_list[i].task_id)
                    }
                }
            }, 
            (err_msg) => {
                this.setState({
                    err_msg: err_msg
                })
            }
        )
    }

    fetchOneTaskPocList = (task_id) => {
        let url = APP_CONFIG.DOMAIN_URL + "task_poc/" + task_id;

        yyq_fetch(url, 'GET', 
            (data) => {
                let index = this.state.task_list.findIndex(item => item.task_id == task_id)
                if(-1 < index) {
                    this.state.task_list[index].poc_name_list = data.poc_name_list
                }

                this.setState({
                    task_list: this.state.task_list
                })

                set_local_stroage_value(KEY_NAME_TASK_LIST, this.state.task_list)
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

    onShowResult = (task, e) => {
        console.log("onShowResult, task = ", task)

        this.setState({show_result: task})
    }

    onBackTaskList = () => {
        this.setState({show_result: null})
    }

    componentDidMount() {
        let ls_value = get_local_stroage_value(KEY_NAME_WEAK_PASSWORD_LIST)
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

        ls_value = get_local_stroage_value(KEY_NAME_TASK_LIST)
        if(ls_value === null) {
            this.fetchAllTaskList()
        } else {
            this.setState({task_list: ls_value})
        }
    }
  
    componentWillUnmount() {
    }

    render() {
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
                    if (0 === record.data_state) {
                        return (
                            <Space>
                            <a onClick={e => {this.onDeleteTask(record.task_id, e)}}><Tooltip title='删除'><CloseCircleOutlined style={{ color: 'hotpink' }} /></Tooltip></a>
                            <a onClick={e => {this.onShowResult(record, e)}}>
                                <Tooltip title='查看结果'><ProfileOutlined style={{ color: 'green' }} /></Tooltip>
                            </a>
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

        let poc_set = [{name:"all", is_set:1}].concat(this.state.poc_list.filter(function(item) {
            return item["is_set"] === 1;
        }))

        if(this.state.err_msg !== "") {
            return (
                <Content>
                    <h1>任务管理</h1>
                    {this.state.err_msg}
                </Content>
            );
        } else if(this.state.show_result !== null) {
            return (
                <Content>
                    <PageHeader className="site-page-header" onBack={this.onBackTaskList} title=" 扫描结果" subTitle={"任务 ID：" + this.state.show_result.task_id} />
                    <Row>
                    <Col flex="16px">&nbsp;</Col>
                    <Col flex="auto"><ShowResult task={this.state.show_result} /></Col>
                    <Col flex="16px">&nbsp;</Col>
                    </Row>
                </Content>
            )
        } else {
            return (
                <Content>
                    <h2>任务管理</h2>
                    <div className="Content">
                    <TaskAdd refresh_list={this.fetchAllTaskList} strategy={this.state.weak_password_list} poc={poc_set} /><br />

                    <Card title="任务列表" extra={<ReloadOutlined style={{ color: 'blue' }} onClick={this.reloadAllList}/>}>
                    <Table dataSource={this.state.task_list} columns={columns} />
                    </Card>
                    </div>
                </Content>
            );
        }

    }
}

export default ContentTask;