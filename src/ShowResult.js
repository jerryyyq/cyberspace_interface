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

    ipsMapToObjectList = (map) => {
        let obj_list = [];
        map.forEach((value, key) => {
            console.log("ipsMapToObjectList, value = ", value)
            let add_obj = {"name": key}

            let ips = ""
            value.forEach(item => {
                if("port" in item) {
                    ips = ips + item["ip"] + ":" + item["port"] + "\n"
                } else {
                    ips = ips + item["ip"] + "\n"
                }
            })
            add_obj["ips"] = ips
            console.log("ipsMapToObjectList, add_obj = ", add_obj)

            obj_list.push(add_obj)
        })

        return obj_list
    }

    itemMapToObjectList = (map) => {
        let obj_list = [];
        map.forEach((value, key) => {
            value.forEach((item, index) => {
                obj_list.push({"name": key, "index": index, "count": value.length, ...item})
            })
        })

        console.log("itemMapToObjectList, obj_list = ", obj_list)
        return obj_list
    }

    sataboxMapToObjectList = (map) => {
        let obj_list = [];
        map.forEach((value, key) => {
            value["ips"].forEach((item, index) => {
                obj_list.push({"name": key, "index": index, "count": value["ips"].length, ...value, "ip": item})
            })
        })

        console.log("sataboxMapToObjectList, obj_list = ", obj_list)
        return obj_list
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
                title: "IP",
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

        let columns_exploit = [
            {
                title: "漏洞名称",
                dataIndex: 'name',
                key: 'name',
                render: (value, row, index) => {
                    const obj = {
                      children: value,
                      props: {},
                    };

                    if (row.index === 0) {
                      obj.props.rowSpan = row["count"];
                    } else {
                      obj.props.rowSpan = 0;
                    }
                    return obj;
                },
            },
            {
                title: 'IP',
                dataIndex: 'ip',
                key: 'ip',
                render: (value, row) => <pre>{value}</pre>,
            },
            {
                title: '端口',
                dataIndex: 'port',
                key: 'port',
                render: (value, row) => <pre>{value}</pre>,
            },
            {
                title: '产品名',
                dataIndex: 'product_name',
                key: 'product_name',
                render: (value, row) => <pre>{value}</pre>,
            },
            {
                title: '产品版本',
                dataIndex: 'product_version',
                key: 'product_version',
                render: (value, row) => <pre>{value}</pre>,
            },
            {
                title: '协议',
                dataIndex: 'protocol_type',
                key: 'protocol_type',
                render: (value, row) => <pre>{value}</pre>,
            },
            {
                title: '口令',
                dataIndex: 'web_weak_info',
                key: 'web_weak_info',
                render: (value, row) => <pre>{value}</pre>,
            },
            {
                title: '危害级别',
                dataIndex: 'exp_level',
                key: 'exp_level',
                render: (value, row) => <pre>{value}</pre>,
            },
        ];

        let columns_satabox = [
            {
                title: "漏洞名称",
                dataIndex: 'name',
                key: 'name',
                render: (value, row, index) => {
                    const obj = {
                      children: value,
                      props: {},
                    };

                    if (row.index === 0) {
                      obj.props.rowSpan = row["count"];
                    } else {
                      obj.props.rowSpan = 0;
                    }
                    return obj;
                },
            },
            {
                title: "CVE 编号",
                dataIndex: 'cve_number',
                key: 'cve_number',
                render: (value, row, index) => {
                    const obj = {
                      children: value,
                      props: {},
                    };

                    if (row.index === 0) {
                      obj.props.rowSpan = row["count"];
                    } else {
                      obj.props.rowSpan = 0;
                    }
                    return obj;
                },
            },
            {
                title: "CNVD 编号",
                dataIndex: 'cnvd_number',
                key: 'cnvd_number',
                render: (value, row, index) => {
                    const obj = {
                      children: value,
                      props: {},
                    };

                    if (row.index === 0) {
                      obj.props.rowSpan = row["count"];
                    } else {
                      obj.props.rowSpan = 0;
                    }
                    return obj;
                },
            },
            {
                title: "危害等级",
                dataIndex: 'danger_level',
                key: 'danger_level',
                render: (value, row, index) => {
                    const obj = {
                      children: value,
                      props: {},
                    };

                    if (row.index === 0) {
                      obj.props.rowSpan = row["count"];
                    } else {
                      obj.props.rowSpan = 0;
                    }
                    return obj;
                },
            },
            {
                title: "0 DAY",
                dataIndex: 'is_zero_vul',
                key: 'is_zero_vul',
                render: (value, row, index) => {
                    const obj = {
                      children: value,
                      props: {},
                    };

                    if (row.index === 0) {
                      obj.props.rowSpan = row["count"];
                    } else {
                      obj.props.rowSpan = 0;
                    }
                    return obj;
                },
            },
            {
                title: "漏洞描述",
                dataIndex: 'vul_des',
                key: 'vul_des',
                render: (value, row, index) => {
                    const obj = {
                      children: <pre>{value}</pre>,
                      props: {},
                    };

                    if (row.index === 0) {
                      obj.props.rowSpan = row["count"];
                    } else {
                      obj.props.rowSpan = 0;
                    }
                    return obj;
                },
            },
            {
                title: "相关连接",
                dataIndex: 'related_links',
                key: 'related_links',
                render: (value, row, index) => {
                    const obj = {
                      children: <pre>{value}</pre>,
                      props: {},
                    };

                    if (row.index === 0) {
                      obj.props.rowSpan = row["count"];
                    } else {
                      obj.props.rowSpan = 0;
                    }
                    return obj;
                },
            },
            {
                title: "补丁地址",
                dataIndex: 'patch_link',
                key: 'patch_link',
                render: (value, row, index) => {
                    const obj = {
                      children: value,
                      props: {},
                    };

                    if (row.index === 0) {
                      obj.props.rowSpan = row["count"];
                    } else {
                      obj.props.rowSpan = 0;
                    }
                    return obj;
                },
            },
            {
                title: 'IP',
                dataIndex: 'ip',
                key: 'ip',
                render: (value, row) => <pre>{value}</pre>,
            },
        ];

        let columns_weak = [
            {
                title: "服务名",
                dataIndex: 'name',
                key: 'name',
                render: (value, row, index) => {
                    const obj = {
                      children: value,
                      props: {},
                    };

                    if (row.index === 0) {
                      obj.props.rowSpan = row["count"];
                    } else {
                      obj.props.rowSpan = 0;
                    }
                    return obj;
                },
            },
            {
                title: 'IP',
                dataIndex: 'ip',
                key: 'ip',
                render: (value, row) => <pre>{value}</pre>,
            },
            {
                title: '端口',
                dataIndex: 'port',
                key: 'port',
                render: (value, row) => <pre>{value}</pre>,
            },
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
                render: (value, row) => <pre>{value}</pre>,
            },
            {
                title: '口令',
                dataIndex: 'password',
                key: 'password',
                render: (value, row) => <pre>{value}</pre>,
            },
        ];        

        let open_port_tcp_map = new Map();
        let open_port_udp_map = new Map();
        let machine_map = new Map();
        let os_map = new Map();
        let honeypot_map = new Map();
        let botnet_map = new Map();
        let weak_map = new Map();
        let exploit_map = new Map();
        let satabox_map = new Map();

        /*
        const OPEN_PORT_TCP_REND = [];
        const OPEN_PORT_UDP_REND = [];
        const MACHINE_RENDER = [];
        const OS_REND = [];
        */

        if(parseInt(this.state._ip_tabs_index) === 5) {
            this.state.result_list.forEach((record) => {
                if(!("satabox_exploit" in record) || record["satabox_exploit"].length < 1) {
                    return true;
                }

                console.log("satabox_exploit = ", record["satabox_exploit"])
                record["satabox_exploit"].forEach((item) => {
                    let statbox_value = {};
                    if(satabox_map.has(item["vul_name"])) {
                        statbox_value = satabox_map.get(item["vul_name"])
                    } else {
                        statbox_value = {...item, "ips":[]}
                    }
    
                    statbox_value["ips"].push({"ip": record["ip"]})
                    satabox_map.set(item["vul_name"], statbox_value)
                })
            })

            /*
            // ----------- 测试数据 -------------
            satabox_map.set("test1", {"vul_des":"OpenSSH是一种协议\r\n\r\nOpenSSH", "cve_number":"CVE-2014-1692", "cnvd_number":"CNVD-2014-00916",
                "danger_level":"高危", "is_zero_vul":"是", "related_links":"http://www.o/#a.d?r1=1.9;r2=1", "patch_link":"http://www.openssh.com/", 
                "ips":["1.1", "1.2"]})
            satabox_map.set("test2", {"vul_des":"OpenSSH是一种协议\r\n\r\nOpenSSH", "cve_number":"CVE-2014-1692", "cnvd_number":"CNVD-2014-00916",
                "danger_level":"高危", "is_zero_vul":"否", "related_links":"http://www.o/#a\r\nhttp://www.p/#b", "patch_link":"http://www.openssh.com/", 
                "ips":["2.1"]})
            */
        } else if(parseInt(this.state._ip_tabs_index) > 0) {
            const TYPE_TITLE = ["IP", "端口号", "机器类型", "操作系统", "漏洞名称", "漏洞名称", "蜜罐类型", "僵尸网络", "服务名"]
            columns = [
                {
                    title: TYPE_TITLE[parseInt(this.state._ip_tabs_index)],
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: 'IP',
                    dataIndex: 'ips',
                    key: 'ips',
                    render: (text, record) => <pre>{text}</pre>,
                },
            ];

            let open_port_arr = this.state.result_list.filter((item) => {
                return item["open_ports_num"] > 0;
            })

            open_port_arr.forEach((record) => {
                // open port
                record["open_ports"].["tcp"].forEach((value, index) => {
                    let item_list = [];
                    if(open_port_tcp_map.has(value)) {
                        item_list = open_port_tcp_map.get(value)
                    }

                    item_list.push({"ip": record["ip"]})
                    open_port_tcp_map.set(value, item_list)
                })

                record["open_ports"].["udp"].forEach((value, index) => {
                    let item_list = [];
                    if(open_port_udp_map.has(value)) {
                        item_list = open_port_udp_map.get(value)
                    }

                    item_list.push({"ip": record["ip"]})
                    open_port_udp_map.set(value, item_list)
                })

                // machine type
                record["machine_type"].forEach((item) => {
                    let item_list = [];
                    if(machine_map.has(item["machine_type"])) {
                        item_list = machine_map.get(item["machine_type"])
                    }

                    item_list.push({"ip": record["ip"]})
                    machine_map.set(item["machine_type"], item_list)
                })

                // os type
                record["os_type"].forEach((item) => {
                    let item_list = [];
                    if(os_map.has(item["os_type"])) {
                        item_list = os_map.get(item["os_type"])
                    }

                    item_list.push({"ip": record["ip"]})
                    os_map.set(item["os_type"], item_list)
                })

                // exploit
                record["exploit_info"].forEach((item) => {
                    let item_list = [];
                    if(exploit_map.has(item["poc_info"])) {
                        item_list = exploit_map.get(item["poc_info"])
                    }

                    item_list.push({"ip": record["ip"], "port": item["port"], 
                        "product_name": item["product_name"], "product_version": item["product_version"],
                        "protocol_type": item["protocol_type"], "web_weak_info": item["web_weak_info"], "exp_level": item["exp_level"],
                    })
                    exploit_map.set(item["poc_info"], item_list)
                })

                // honey pot
                record["honeypot_info"].forEach((item) => {
                    let item_list = [];
                    if(honeypot_map.has(item["honeypot_name"])) {
                        item_list = honeypot_map.get(item["honeypot_name"])
                    }

                    item_list.push({"ip": record["ip"], "port": item["honeypot_port"]})
                    honeypot_map.set(item["honeypot_name"], item_list)
                })

                // botnet
                record["botnet_info"].forEach((item) => {
                    let item_list = [];
                    if(botnet_map.has(item["botnet_name"])) {
                        item_list = botnet_map.get(item["botnet_name"])
                    }

                    item_list.push({"ip": record["ip"], "port": item["botnet_port"]})
                    botnet_map.set(item["botnet_name"], item_list)
                })

                // weak
                record["weak_info"].forEach((item) => {
                    let item_list = [];
                    if(weak_map.has(item["service"])) {
                        item_list = weak_map.get(item["service"])
                    }

                    item_list.push({"ip": item["host"], "port": item["port"], "username": item["username"], "password": item["password"]})
                    weak_map.set(item["service"], item_list)
                })

                // ----------- 测试数据 -------------
                // weak_map.set("test1", [{"ip":"1", "port":21, "username":"wo", "password":"p1"},{"ip":"2", "port":21, "username":"wo", "password":"p2"}])
                // weak_map.set("test2", [{"ip":"3", "port":23, "username":"wo", "password":"p3"}])
            })

            /*
            /////////////////////////// render ////////////////////////////
            // open port
            open_port_tcp_map.forEach((value, key) => {
                console.log("open_port_tcp_map: " + key + " = " + value);
                OPEN_PORT_TCP_REND.push(<tr><td> {key} </td><td> <pre>{value["ips"].join("\n")}</pre> </td></tr>)
            })

            open_port_udp_map.forEach((value, key) => {
                console.log("open_port_udp_map: " + key + " = " + value);
                OPEN_PORT_UDP_REND.push(<tr><td> {key} </td><td> <pre>{value["ips"].join("\n")}</pre> </td></tr>)
            })

            // machine type
            machine_map.forEach((value, key) => {
                console.log("machine_map: " + key + " = " + value);
                MACHINE_RENDER.push(<tr><td> {key} </td><td> <pre>{value["ips"].join("\n")}</pre> </td></tr>)
            })
            
            // os type
            os_map.forEach((value, key) => {
                console.log("os_map: " + key + " = " + value);
                OS_REND.push(<tr><td> {key} </td><td> <pre>{value["ips"].join("\n")}</pre> </td></tr>)
            })
            */
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
                {/*<table border="1"><thead><tr><td> 端口号 </td><td> IP </td></tr></thead><tbody>
                    {OPEN_PORT_TCP_REND}
                </tbody></table>*/}
                <Table pagination={{ pageSize: 50 }} dataSource={this.ipsMapToObjectList(open_port_tcp_map)} columns={columns} />

                <h3>UDP</h3>
                {/*<table border="1"><thead><tr><td> 端口号 </td><td> IP </td></tr></thead><tbody>
                    {OPEN_PORT_UDP_REND}
                </tbody></table>*/}

                <Table pagination={{ pageSize: 50 }} dataSource={this.ipsMapToObjectList(open_port_udp_map)} columns={columns} />
            </TabPane>

            <TabPane tab="设备" key="2">
                {/*<table border="1"><thead><tr><td> 机器类型 </td><td> IP </td></tr></thead><tbody>
                    {MACHINE_RENDER}
                </tbody></table>*/}
                <Table pagination={{ pageSize: 50 }} dataSource={this.ipsMapToObjectList(machine_map)} columns={columns} />
            </TabPane>

            <TabPane tab="操作系统" key="3">
                {/*<table border="1"><thead><tr><td> 操作系统 </td><td> IP </td></tr></thead><tbody>
                    {OS_REND}
                </tbody></table>*/}
                <Table pagination={{ pageSize: 50 }} dataSource={this.ipsMapToObjectList(os_map)} columns={columns} />
            </TabPane>

            <TabPane tab="扫描漏洞" key="4">
                <Table pagination={{ pageSize: 50 }} dataSource={this.itemMapToObjectList(exploit_map)} columns={columns_exploit} />
            </TabPane>

            <TabPane tab="系统漏洞" key="5">
                <Table pagination={{ pageSize: 50 }} dataSource={this.sataboxMapToObjectList(satabox_map)} columns={columns_satabox} />
            </TabPane>

            <TabPane tab="蜜罐" key="6">
                <Table pagination={{ pageSize: 50 }} dataSource={this.ipsMapToObjectList(honeypot_map)} columns={columns} />
            </TabPane>

            <TabPane tab="僵尸网络" key="7">
                <Table pagination={{ pageSize: 50 }} dataSource={this.ipsMapToObjectList(botnet_map)} columns={columns} />
            </TabPane>

            <TabPane tab="弱口令" key="8">
                <Table pagination={{ pageSize: 50 }} dataSource={this.itemMapToObjectList(weak_map)} columns={columns_weak} />
            </TabPane>
            </Tabs>
            </div>
        )
    }
}

export default ShowResult;