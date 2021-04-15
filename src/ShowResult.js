import React from 'react';
import { Tabs, Table } from 'antd';
import { yyq_fetch, get_local_stroage_value, set_local_stroage_value } from './public_fun.js';
import ReactJson from 'react-json-view'

import './App.css';

const { TabPane } = Tabs;

const KEY_NAME_TASK_RESULT = "_ls_result_"

class ShowResult extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            err_msg: "",
            result_list: [],
            _ip_tabs_index: "0"
        };
    }

    onChangeTabs = (key) => {
        this.setState({ _ip_tabs_index: key })
    }

    fetchAllScanResultList = () => {
        console.log("window.location = ", window.location)
        let RESULT_URL = window.location.protocol + "://" + window.location.hostname + ":29090/cloud_receive_api/scan_result/"
        let url = RESULT_URL + this.props.task.task_id + "/"

        for(let i = 0; i < this.props.task.ip_group_count; i++) {
            url = url + i
            console.log("fetchAllScanResultList, url = ", url)

            yyq_fetch(url, 'GET', 
            (data) => {
                this.setState({
                    result_list: this.state.result_list.concat(data.machine_info)
                }, ()=> {
                    set_local_stroage_value(KEY_NAME_TASK_RESULT + this.props.task.task_id, this.state.result_list)
                })
            }, 
            (err_msg) => {
                this.setState({
                    err_msg: err_msg
                })
            })
        }
    }

    componentDidMount() {
        let ls_value = get_local_stroage_value(KEY_NAME_TASK_RESULT + this.props.task.task_id)
        if(ls_value === null) {
            this.fetchAllScanResultList()
        } else {
            this.setState({result_list: ls_value})
        }
    }
  
    componentWillUnmount() {
    }

    render() {
        const columns = [
            {
                title: 'IP',
                dataIndex: 'ip',
                key: 'ip',
            },
            {
                title: '数据',
                dataIndex: 'data',
                key: 'data',
                render: (text, record) => <ReactJson src={record} displayObjectSize={false} displayDataTypes={false} />,
            },
        ];

        return (
            <Tabs defaultActiveKey={this.state._ip_tabs_index} onChange={this.onChangeTabs}>
            <TabPane tab={<span style={{fontSize:18}}>总览</span>} key="0">
                <Table dataSource={this.state.result_list} columns={columns} />
            </TabPane>

            <TabPane tab="设备" key="1">
            </TabPane>

            <TabPane tab="开放端口" key="2">
            </TabPane>

            <TabPane tab="漏洞" key="3">
            </TabPane>

            <TabPane tab="蜜罐" key="4">
            </TabPane>

            <TabPane tab="僵尸网络" key="5">
            </TabPane>

            <TabPane tab="弱口令" key="6">
            </TabPane>
            </Tabs>
        )
    }
}

export default ShowResult;