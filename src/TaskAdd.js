import React from 'react';
import memoize from "memoize-one";
import { Collapse, Radio, Input, Select, Tabs, Button, Checkbox, Upload, Row, Col } from 'antd';
import { APP_CONFIG, RED_STAR, yyq_fetch, string_is_empty } from './public_fun.js';
import { UpOutlined, UploadOutlined } from '@ant-design/icons';

import './App.css';

const { Panel } = Collapse;
const { Option } = Select;
const { TabPane } = Tabs;

class TaskAdd extends React.Component {
    constructor(props) {
        super(props);
        console.log("props.strategy = ", props.strategy, ", props.poc = ", props.poc, ", props.node_tag = ", props.node_tag)

        this.state = {
            err_msg: "",
            task_name: "",
            priority: 1,
            scan_type: "2",
            is_tiny_task: false,
            node_tag_list: [],
            strategy: "",
            poc_name_list: ["all"],
            template: "top10",
            ip_list: "",
            tport_list: "",
            uport_list: "",
            task_id: "",
            _active_key: "",
            _ip_tabs_index: "0",
            _port_tabs_index: "0",
            template_list: [],
            upload_files: [],
        };
    }

    get_default_strategy = memoize(
        (strategy_list, strategy) => {
            if(strategy === "") {
                if(strategy_list.length > 0) {
                    return strategy_list[0].name
                }
            } else {
                if(strategy_list.length > 0) {
                    if(0 > strategy_list.findIndex(item => item.name === strategy)) {
                        return strategy_list[0].name
                    }
                }
            }

            return strategy
        }
    );

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

    onChangeTinyTask = (e) => {
        this.setState({ is_tiny_task: e.target.checked })
    }

    onChangeNodeTag = (value) => {
        console.log("onChangeNodeTag value = ", value);
        this.setState({ node_tag_list: value })
    }

    onChangeStrategy = (e) => {
        console.log("e.target.value = ", e.target.value);
        this.setState({ strategy: e.target.value })
    }

    onChangePocName = (value) => {
        console.log("onChangePocName value = ", value);
        if(value.includes("all")) {
            value = ["all"]
            console.log("onChangePocName find 'all', value = ", value);

        }

        this.setState({ poc_name_list: value })
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
            alert("任务名称不能为空！task_name = " + this.state.task_name);
            return;
        }
        formData.append("task_name", this.state.task_name);
        formData.append("priority", parseInt(this.state.priority));
        formData.append("scan_type", this.state.scan_type);

        if(this.state.is_tiny_task){        
            formData.append("is_tiny_task", 1);
        }

        if(0 < this.state.node_tag_list.length) {
            console.log("this.state.node_tag_list = ", this.state.node_tag_list);
            formData.append("node_tag", this.state.node_tag_list);
        }

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
            if(string_is_empty(this.state.strategy)){
                alert("策略名不能为空！");
                return;
            }
            formData.append("strategy", this.state.strategy);
        } else if (this.state.scan_type === "4") {
            if(1 > this.state.poc_name_list.length){
                alert("POC 列表不能为空！");
                return;
            }
            formData.append("poc_name_list", this.state.poc_name_list);
        }
        console.log("formData = ", formData)

        let fetch_data = formData
        if(this.state._ip_tabs_index === "0") {
            let object = {};
            formData.forEach((value, key) => {object[key] = value});
            object["priority"] = parseInt(object["priority"])
            fetch_data = object;
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
                alert("提交成功！任务 ID 是：" + data.task_id + "\n创建需要时间，请稍后刷新列表获取最终任务信息。")
                this.props.onChange(data.task_id)
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

                data.template_list.forEach(template_name => {
                    // console.log("template_name = ", template_name)
                    this.fetchOnePortTemplateInfo(template_name)
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

        const default_strategy = this.get_default_strategy(this.props.strategy, this.state.strategy);

        if (this.state.scan_type === "3") {
            ATTACH_INPUT = <Row gutter={[16, 124]}><Col span={24}><span className="tag_width">{RED_STAR}策略名：</span>
            
            <Radio.Group onChange={this.onChangeStrategy} value={default_strategy}>
            {Array.from(this.props.strategy, (e, i) => {
                return <Radio value={e.name} key={i}>{e.name}</Radio>
            })}
            </Radio.Group>

            </Col></Row>
        } else if (this.state.scan_type === "4") {
            ATTACH_INPUT = <Row gutter={[16, 124]}><Col span={24}><span className="tag_width">{RED_STAR}POC 列表：</span>

            <Select mode="multiple" allowClear className="keep_tag" value={this.state.poc_name_list} onChange={this.onChangePocName}>
            {Array.from(this.props.poc, (e, i) => {
                return <Option key={e.name}>{e.name}</Option>
            })}
            </Select>
            
            </Col></Row>
        }

        return (
            <Collapse defaultActiveKey={['1']} activeKey={this.state._active_key} onChange={this.onChangeActiveKey}
                expandIconPosition="right" expandIcon={({ isActive }) => <UpOutlined rotate={isActive ? 0 : 180} />} >
            <Panel header="添加任务" key="1">
            <Row gutter={[16, 24]}>
                <Col span={12}><span className="tag_width">{RED_STAR}任务名称：</span><Input className="keep_tag" value={this.state.task_name} onChange={this.onChangeTaskName}/></Col>
                <Col span={6}>{RED_STAR}优先级：<Select defaultValue={this.state.priority} onChange={this.onChangePriority}>
                    {Array.from(Array(10), (e, i) => {
                        return <Option value={i+1} key={i+1}>{i+1}</Option>
                    })}
                </Select></Col>
                <Col span={6}>{RED_STAR}扫描类型：<Select defaultValue={this.state.scan_type} onChange={this.onChangeScanType}>
                    <Option value="1" key="1">快速探测</Option>
                    <Option value="2" key="2">普通探测</Option>
                    <Option value="3" key="3">弱口令探测</Option>
                    <Option value="4" key="4">POC探测</Option>
                    <Option value="5" key="5">密罐探测</Option>
                    <Option value="6" key="6">工控探测</Option>
                    <Option value="7" key="7">僵网探测</Option>
                    <Option value="8" key="8">直接扫描</Option>
                    <Option value="9" key="9">域名探测</Option>
                </Select></Col>
            </Row><p/>

            <Row gutter={[16, 24]}>
                <Col span={4}>小任务(不分片)：<Checkbox checked={this.state.is_tiny_task} onChange={this.onChangeTinyTask}></Checkbox></Col>
                <Col span={20}>节点标签：<Select mode="multiple" allowClear className="keep_tag" value={this.state.node_tag_list} onChange={this.onChangeNodeTag}>
                    {Array.from(this.props.node_tag, (e, i) => {
                        return <Option key={e.node_tag}>{e.node_tag}</Option>
                    })}
                    </Select>
                </Col>
            </Row><p/>

            { ATTACH_INPUT }

            <Row gutter={[16, 124]}><Col span={24}>
                <Tabs defaultActiveKey={this.state._ip_tabs_index} onChange={this.onChangeIpTabs}>
                    <TabPane tab="输入 IP 列表" key="0">
                    <span className="tag_width">{RED_STAR}IP 列表：</span><Input className="keep_tag" value={this.state.ip_list} onChange={this.onChangeIpList}/>
                    </TabPane>
                    <TabPane tab="上传 IP 列表" key="1">
                        {RED_STAR}<Upload accept=".zip" fileList={this.state.upload_files} beforeUpload={this.handleBeforeUpload} onChange={this.onSelectFile}>
                            <Button icon={<UploadOutlined />}>选择文件</Button>
                        </Upload>
                    </TabPane>
                </Tabs>
            </Col></Row>
            <Row gutter={[16, 124]}><Col span={24}>
                <Tabs defaultActiveKey={this.state._port_tabs_index} onChange={this.onChangePortTabs}>
                    <TabPane tab="端口列表" key="0">
                        <span className="tag_width">{RED_STAR}TCP 端口：</span><Input className="keep_tag" value={this.state.tport_list} onChange={this.onChangeTcpPort}/>
                        <p></p>
                        <span className="tag_width">UDP 端口：</span><Input className="keep_tag" value={this.state.uport_list} onChange={this.onChangeUdpPort}/>
                    </TabPane>
                    <TabPane tab="端口模板" key="1">
                    {RED_STAR}<Select defaultValue={this.state.template} onChange={this.onChangeTemplate}>
                        {Array.from(this.state.template_list, (e, i) => {
                            // console.log("e = ", e)
                            return <Option value={e} key={e}>{e}</Option>
                        })}
                    </Select><p/>
                    {JSON.stringify(this.state['_pt_' + this.state.template])}
                    </TabPane>
                </Tabs>
            </Col></Row>


                <Button type="primary" onClick={this.onSubmitForm}>提交</Button>
            </Panel>
            </Collapse>
        )
    }
}

export default TaskAdd;
