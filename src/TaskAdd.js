import React from 'react';
import { Collapse, Space, Input, Select, Tabs, Button, Upload } from 'antd';
import { APP_CONFIG, yyq_fetch, string_is_empty } from './public_fun.js';
import { UpOutlined, UploadOutlined } from '@ant-design/icons';

import './App.css';

const { Panel } = Collapse;
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
            _active_key: "",
            _ip_tabs_index: "0",
            _port_tabs_index: "0",
            template_list: [],
            upload_files: []
        };
    }

    onChangeTaskName = (e) => {
        // console.log("e = ", e, ", value = ", e.target.value)
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

    onChangeActiveKey = (key) => {
        console.log("key = ", key);
        this.setState({ _active_key: key })
    }

    onChangeIpTabs = (key) => {
        this.setState({ _ip_tabs_index: key })
    }

    onChangePortTabs = (key) => {
        this.setState({ _port_tabs_index: key })
    }

    onChangeIpList = (e) => {
        this.setState({ ip_list: e.target.value })
    }

    onSelectFile = (info) => {
        console.log(info);
        let fileList = [...info.fileList];
        fileList = fileList.slice(-1);

        this.setState({ upload_files: fileList });
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

    handleBeforeUpload = (file) => {
        return false
    }

    onSubmitForm = (e) => {
        let url = APP_CONFIG.DOMAIN_URL + 'scan_task'
        const formData = new FormData();

        if(string_is_empty(this.state.task_name)){
            alert("任务名称不能为空！");
            return;
        }
        formData.append("task_name", this.state.task_name);
        formData.append("priority", parseInt(this.state.priority));
        formData.append("scan_type", this.state.scan_type);

        if(this.state._ip_tabs_index === "0"){
            if(string_is_empty(this.state.ip_list)){
                alert("IP 列表不能为空！");
                return;
            }
            formData.append("ip_list", this.state.ip_list);
        } else if(this.state._ip_tabs_index === "1"){
            if(1 > this.state.upload_files.length){
                alert("请选择一个 IP 列表文件！");
                return;
            }
            formData.append("upload", this.state.upload_files[0].originFileObj);
            url = APP_CONFIG.DOMAIN_URL + 'scan_task/upload'
        }

        if(this.state._port_tabs_index === "0"){
            if(string_is_empty(this.state.tport_list)){
                alert("TCP 端口列表不能为空！");
                return;
            }
            formData.append("tport_list", this.state.tport_list);
            formData.append("uport_list", this.state.uport_list);
        } else if(this.state._port_tabs_index === "1"){
            formData.append("template", this.state.template);
        }

        if(this.state.scan_type === "3") {
            formData.append("strategy", this.state.strategy);
        } else if (this.state.scan_type === "4") {
            formData.append("poc_name_list", this.state.poc_name_list);
        }
        console.log("formData = ", formData)

        let fetch_data = formData
        if(this.state._ip_tabs_index === "0") {
            let object = {};
            formData.forEach((value, key) => {object[key] = value});
            object["priority"] = parseInt(object["priority"])
            fetch_data = JSON.stringify(object);
        } else {
            /*
            const data = new URLSearchParams();
            for (const pair of formData) {
                data.append(pair[0], pair[1]);
            }
            fetch_data = data
            */
        }
        console.log("fetch_data = ", fetch_data)

        yyq_fetch(url, 'POST', data => {
                alert("提交成功！任务 ID 是：" + data.task_id + "\n创建需要时间，请稍后刷新列表获取任务信息。\n请不要重复提交。")
                this.setState({_active_key: ""})
            }, (err_msg) => {
                alert("提交失败: " + err_msg);
            }, fetch_data)
    }

    fetchAllPortTemplateList = () => {
        console.log("fetchAllPortTemplateList")
        let url = APP_CONFIG.DOMAIN_URL + "template/port_template_list";

        yyq_fetch(url, 'GET', 
            (data) => {
                this.setState({
                    template_list: data.template_list
                })

                Array.from(data.template_list, (e, i) => {
                    // console.log("e = ", e)
                    this.fetchOnePortTemplateInfo(e)
                })
            }, 
            (err_msg) => {
                this.setState({
                    err_msg: err_msg
                })
            }
        )
    }

    fetchOnePortTemplateInfo = (template_name) => {
        let url = APP_CONFIG.DOMAIN_URL + "template/port_template/" + template_name;
        yyq_fetch(url, 'GET', 
        (data) => {
            this.setState({
                ['_pt_' + template_name]: data.template
            })
        }, 
        (err_msg) => {
            console.log("fetchOnePortTemplateInfo(" + template_name + "), err_msg = ", err_msg)
            this.setState({
                err_msg: err_msg
            })
        })
    }

    componentDidMount() {
        this.fetchAllPortTemplateList()
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
            <Collapse defaultActiveKey={['1']} activeKey={this.state._active_key} onChange={this.onChangeActiveKey}
                expandIconPosition="right" expandIcon={({ isActive }) => <UpOutlined rotate={isActive ? 0 : 180} />} >
            <Panel header="添加任务" key="1">
                <p></p><Space>
                任务名称：<Input value={this.state.task_name} style={{ width: 300 }} onChange={this.onChangeTaskName}/>
                优先级：<Select defaultValue={this.state.priority} onChange={this.onChangePriority}>
                    {Array.from(Array(10), (e, i) => {
                        return <Option value={i+1} key={i+1}>{i+1}</Option>
                    })}
                </Select>
                扫描类型：<Select defaultValue={this.state.scan_type} onChange={this.onChangeScanType}>
                    <Option value="1" key="1">快速探测</Option>
                    <Option value="2" key="21">普通探测</Option>
                    <Option value="3" key="3">弱口令探测</Option>
                    <Option value="4" key="4">POC探测</Option>
                    <Option value="5" key="5">密罐探测</Option>
                    <Option value="6" key="6">工控探测</Option>
                    <Option value="7" key="7">僵网探测</Option>
                </Select>
                </Space><p></p>

                { ATTACH_INPUT }

                <p></p><Tabs defaultActiveKey={this.state._ip_tabs_index} onChange={this.onChangeIpTabs}>
                    <TabPane tab="输入 IP 列表" key="0">
                        <Input addonBefore="IP 列表：" value={this.state.ip_list} onChange={this.onChangeIpList}/>
                    </TabPane>
                    <TabPane tab="上传 IP 列表" key="1">
                        <Upload accept=".zip" fileList={this.state.upload_files} beforeUpload={this.handleBeforeUpload} onChange={this.onSelectFile}>
                            <Button icon={<UploadOutlined />}>选择文件</Button>
                        </Upload>
                    </TabPane>
                </Tabs><p></p>
                <p></p>
                <Tabs defaultActiveKey={this.state._port_tabs_index} onChange={this.onChangePortTabs}>
                    <TabPane tab="端口列表" key="0">
                        <Input addonBefore="TCP 端口：" value={this.state.tport_list}  onChange={this.onChangeTcpPort}/>
                        <Input addonBefore="UDP 端口：" value={this.state.uport_list}  onChange={this.onChangeUdpPort}/>
                    </TabPane>
                    <TabPane tab="端口模板" key="1">
                    <Select defaultValue={this.state.template} onChange={this.onChangeTemplate}>
                        {Array.from(this.state.template_list, (e, i) => {
                            // console.log("e = ", e)
                            return <Option value={e} key={e}>{e}</Option>
                        })}
                    </Select><p></p>
                    {JSON.stringify(this.state['_pt_' + this.state.template])}
                    </TabPane>
                </Tabs>
                <p></p>
                <Button type="primary" onClick={this.onSubmitForm}>提交</Button>
            </Panel>
            </Collapse>
        )
    }
}

export default TaskAdd;