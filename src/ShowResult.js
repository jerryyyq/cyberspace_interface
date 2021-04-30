import React from 'react';
import { Tabs, Table } from 'antd';
import { yyq_fetch, get_local_stroage_value, set_local_stroage_value } from './public_fun.js';
import ResultFind from './ResultFind.js';
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
        console.log("window.location = ", window.location, ", location.hostname = ", window.location.hostname)
        let RESULT_URL = window.location.protocol + "//" + window.location.hostname + ":29090/cloud_receive_api/scan_result/"
        let url = RESULT_URL + this.props.task.task_id + "/"
        console.log("url = ", url)

        for(let i = 0; i < this.props.task.ip_group_count; i++) {
            url = url + i
            // console.log("fetchAllScanResultList, url = ", url)

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
        let columns = [
            {
                title: 'IP',
                dataIndex: 'ip',
                key: 'ip',
            },
            {
                title: '数据',
                dataIndex: 'data',
                key: 'data',
                render: (text, record) => <ReactJson src={record} collapsed={1} displayObjectSize={false} displayDataTypes={false} />,
            },
        ];

        const OPEN_PORT_TCP_REND = [];
        const OPEN_PORT_UDP_REND = [];
        const MACHINE_RENDER = [];
        const OS_REND = [];

        if(parseInt(this.state._ip_tabs_index) > 0) {
            let open_port_tcp_map = new Map();
            let open_port_udp_map = new Map();
            let machine_map = new Map();
            let os_map = new Map();

            let open_port_arr = this.state.result_list.filter((item) => {
                return item["open_ports_num"] > 0;
            })

            open_port_arr.forEach((record) => {
                // open port
                record["open_ports"].["tcp"].forEach((value, index) => {
                    let port_ips = [];
                    if(open_port_tcp_map.has(value)) {
                        port_ips = open_port_tcp_map.get(value)
                    }

                    port_ips.push(record["ip"])
                    open_port_tcp_map.set(value, port_ips)
                })

                record["open_ports"].["udp"].forEach((value, index) => {
                    let port_ips = [];
                    if(open_port_udp_map.has(value)) {
                        port_ips = open_port_udp_map.get(value)
                    }

                    port_ips.push(record["ip"])
                    open_port_udp_map.set(value, port_ips)
                })

                // machine type
                record["machine_type"].forEach((item) => {
                    let machine_ips = [];
                    if(machine_map.has(item["machine_type"])) {
                        machine_ips = machine_map.get(item["machine_type"])
                    }

                    machine_ips.push(record["ip"])
                    machine_map.set(item["machine_type"], machine_ips)
                })

                // os type
                record["os_type"].forEach((item) => {
                    let os_ips = [];
                    if(os_map.has(item["os_type"])) {
                        os_ips = os_map.get(item["os_type"])
                    }

                    os_ips.push(record["ip"])
                    os_map.set(item["os_type"], os_ips)
                })
            })

            /////////////////////////// render ////////////////////////////
            // open port
            open_port_tcp_map.forEach((value, key) => {
                console.log("open_port_tcp_map: " + key + " = " + value);
                OPEN_PORT_TCP_REND.push(<tr><td> {key} </td><td> <pre>{value.join("\n")}</pre> </td></tr>)
            })

            open_port_udp_map.forEach((value, key) => {
                console.log("open_port_udp_map: " + key + " = " + value);
                OPEN_PORT_UDP_REND.push(<tr><td> {key} </td><td> <pre>{value.join("\n")}</pre> </td></tr>)
            })

            // machine type
            machine_map.forEach((value, key) => {
                console.log("machine_map: " + key + " = " + value);
                MACHINE_RENDER.push(<tr><td> {key} </td><td> <pre>{value.join("\n")}</pre> </td></tr>)
            })
            
            // os type
            os_map.forEach((value, key) => {
                console.log("os_map: " + key + " = " + value);
                OS_REND.push(<tr><td> {key} </td><td> <pre>{value.join("\n")}</pre> </td></tr>)
            })
        }

        return (
            <div className="Content">
            <ResultFind result_list={this.state.result_list} />

            <Tabs defaultActiveKey={this.state._ip_tabs_index} onChange={this.onChangeTabs}>
            <TabPane tab={<span style={{fontSize:18}}>总览</span>} key="0">
                <Table pagination={{ pageSize: 50 }} dataSource={this.state.result_list} columns={columns} />
            </TabPane>

            <TabPane tab="开放端口" key="1">
                <h3>TCP</h3>
                <table border="1"><thead><tr><td> 端口号 </td><td> IP </td></tr></thead><tbody>
                    {OPEN_PORT_TCP_REND}
                </tbody></table>

                <h3>UDP</h3>
                <table border="1"><thead><tr><td> 端口号 </td><td> IP </td></tr></thead><tbody>
                    {OPEN_PORT_UDP_REND}
                </tbody></table>
            </TabPane>

            <TabPane tab="设备" key="2">
                <table border="1"><thead><tr><td> 机器类型 </td><td> IP </td></tr></thead><tbody>
                    {MACHINE_RENDER}
                </tbody></table>
            </TabPane>

            <TabPane tab="操作系统" key="3">
                <table border="1"><thead><tr><td> 操作系统 </td><td> IP </td></tr></thead><tbody>
                    {OS_REND}
                </tbody></table>
            </TabPane>

            <TabPane tab="漏洞" key="4">
            </TabPane>

            <TabPane tab="蜜罐" key="5">
            </TabPane>

            <TabPane tab="僵尸网络" key="6">
            </TabPane>

            <TabPane tab="弱口令" key="7">
            </TabPane>
            </Tabs>
            </div>
        )
    }
}

export default ShowResult;