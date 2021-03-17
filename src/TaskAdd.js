import React from 'react';
import { Card, Space, Input, Select, Tabs, Button } from 'antd';
import { APP_CONFIG, yyq_fetch, string_is_empty } from './public_fun.js';

import './App.css';

const { Option } = Select;
const { TabPane } = Tabs;

class TaskAdd extends React.Component {
    constructor(props) {
        super(props);

        const { old_task } = props;

        this.state = {
            err_msg: "",
            task_name: "",
            priority: 1,
            scan_type: "2",
            strategy: "default",
            poc_name_list: "all",
            template: "top10",
            ip_list: "",
            tport_list: "",
            uport_list: "",
            task_id: "",
            _ip_tabs_index: "0",
            _port_tabs_index: "0",
            template_list: [],
            upload_file: ""
        };
    }

    onChangeTaskName = (e) => {
        console.log("e = ", e, ", value = ", e.target.value)
        this.setState({ task_name: e.target.value })
    }

    onChangePriority = (value) => {
        this.setState({ priority: value })
    }

    onChangeScanType = (value) => {
        this.setState({ scan_type: value })
    }

    onChangeStrategy = (e) => {
        this.setState({ strategy: e.target.value })
    }

    onChangePocName = (e) => {
        this.setState({ poc_name_list: e.target.value })
    }

    onChangeIpList = (e) => {
        this.setState({ ip_list: e.target.value })
    }

    onSelectFile = (e) => {
        // var files = e.target.files;
        // console.log(files);
        // var filesArr = Array.prototype.slice.call(files);
        // console.log(filesArr);
        this.setState({ upload_file: e.target.files[0] });
    }

    onChangeTcpPort = (e) => {
        this.setState({ tport_list: e.target.value })
    }

    onChangeUdpPort = (e) => {
        this.setState({ uport_list: e.target.value })
    }

    onChangeTemplate = (value) => {
        this.setState({ template: value })
    }

    onSubmitForm = (e) => {
        if(string_is_empty(this.state.task_name)){
            alert("任务名称不能为空！");
            return;
        }

        if(this.state._ip_tabs_index === "0"){
            if(string_is_empty(this.state.ip_list)){
                alert("IP 列表不能为空！");
                return;
            }
        } else if(this.state._ip_tabs_index === "1"){
            if(string_is_empty(this.state.upload_file)){
                alert("请选择一个 IP 列表文件！");
                return;
            }
        }

        if(this.state._port_tabs_index === "0"){
            if(string_is_empty(this.state.tport_list)){
                alert("TCP 端口列表不能为空！");
                return;
            }
        }










        const formData = new FormData();
        formData.append("task_name", this.state.task_name);
        formData.append("upload", this.state.upload_file);
      
        let url = APP_CONFIG.DOMAIN_URL + 'scan_task/upload'

        yyq_fetch(url, 'POST', data => this.props.refresh_list, (err_msg) => {alert("Submit Error: " + err_msg);})
    }

    fetchAllTemplateList = () => {
        let url = APP_CONFIG.DOMAIN_URL + "template/port_template_list";

        yyq_fetch(url, 'GET', 
            (data) => {
                this.setState({
                    template_list: data.template_list
                })
            }, 
            (err_msg) => {
                this.setState({
                    err_msg: err_msg
                })
            }
        )
    }

    componentDidMount() {
        this.fetchAllTemplateList()
    }
  
    componentWillUnmount() {
    }

    render() {
        let ATTACH_INPUT;
        if (this.state.scan_type === "3") {
            ATTACH_INPUT = <Input addonBefore="策略名：" value={this.state.strategy} onChange={this.onChangeStrategy}/>
        } else if (this.state.scan_type === "4") {
            ATTACH_INPUT = <Input addonBefore="POC 列表：" value={this.state.poc_name_list} onChange={this.onChangePocName}/>
        }

        return (
            <Card title="添加任务">
                <p></p><Space>
                任务名称：<Input value={this.state.task_name} style={{ width: 300 }} onChange={this.onChangeTaskName}/>
                优先级：<Select defaultValue={this.state.priority} onChange={this.onChangePriority}>
                    {Array.from(Array(10), (e, i) => {
                        return <Option value={i+1}>{i+1}</Option>
                    })}
                </Select>
                扫描类型：<Select defaultValue={this.state.scan_type} onChange={this.onChangeScanType}>
                    <Option value="1">快速探测</Option>
                    <Option value="2">普通探测</Option>
                    <Option value="3">弱口令探测</Option>
                    <Option value="4">POC探测</Option>
                    <Option value="5">密罐探测</Option>
                    <Option value="6">工控探测</Option>
                    <Option value="7">僵网探测</Option>
                </Select>
                </Space><p></p>

                { ATTACH_INPUT }

                <p></p><Tabs defaultActiveKey={this.state._ip_tabs_index}>
                    <TabPane tab="输入 IP 列表" key="0">
                        <Input addonBefore="IP 列表：" value={this.state.ip_list} onChange={this.onChangeIpList}/>
                    </TabPane>
                    <TabPane tab="上传 IP 列表" key="1">
                        <Input type="file" name="upload" accept=".zip" value={this.state.upload_file} onChange={this.onSelectFile}/>
                    </TabPane>
                </Tabs><p></p>
                <p></p>
                <Tabs defaultActiveKey={this.state._port_tabs_index}>
                    <TabPane tab="端口列表" key="0">
                        <Input addonBefore="TCP 端口：" value={this.state.tport_list}  onChange={this.onChangeTcpPort}/>
                        <Input addonBefore="UDP 端口：" value={this.state.uport_list}  onChange={this.onChangeUdpPort}/>
                    </TabPane>
                    <TabPane tab="端口模板" key="1">
                    <Select defaultValue={this.state.template} onChange={this.onChangeTemplate}>
                        {Array.from(this.state.template_list, (e, i) => {
                            // console.log("e = ", e)
                            return <Option value={e}>{e}</Option>
                        })}
                    </Select>
                    </TabPane>
                </Tabs>
                <p></p>
                <Button type="primary" onClick={this.onSubmitForm}>提交</Button>
            </Card>
        )
    }
}

export default TaskAdd;