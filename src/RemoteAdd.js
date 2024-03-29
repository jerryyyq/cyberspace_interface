import React from 'react';
import { Collapse, Input, Button, InputNumber, Row, Col } from 'antd';
import { APP_CONFIG, RED_STAR, yyq_fetch, string_is_empty } from './public_fun.js';
import { UpOutlined } from '@ant-design/icons';

import './App.css';

const { Panel } = Collapse;
const { TextArea } = Input;

class RemoteAdd extends React.Component {
    constructor(props) {
        console.log("props = ", props)
        super(props);

        this.state = {
            err_msg: "",
            id: 0,
            ip: "",
            ssh_port: 22,
            user_name: "",
            password: "",
            explanation: "",
            preset_node_id: "",
            center_ip: "",
            center_api_port: 29080,
            center_data_port: 29090,
            _active_key: ""
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log("getDerivedStateFromProps nextProps = ", nextProps, ", prevState = ", prevState)

        let new_state = null
        if(nextProps.edit_record) {
            if (nextProps.edit_record.id !== prevState.id) {
                new_state = nextProps.edit_record
                new_state["_active_key"] = "1"
            } 
        } else if(0 !== prevState.id) {
            new_state = {"id": 0}
            new_state["_active_key"] = ""
        }

        /*
        let new_active_key = nextProps.expand ? "1" : ""
        if(new_active_key !== prevState._active_key) {
            if(new_state === null) {
                new_state = {_active_key: new_active_key}
            } else {
                new_state["_active_key"] = new_active_key
            }
        }
        */

        console.log("new_state = ", new_state)
        return new_state
    }

    onChangeActiveKey = (key) => {
        console.log("key = ", key);

        if (key === "1") {
            this.setState({ _active_key: key })
        } else {
            if(this.state.id === 0) {
                this.setState({ _active_key: "" })
            } else {
                this.props.onChange(true)
            }
        }
    }

    onChangeIP = (e) => {
        // console.log("e = ", e, ", value = ", e.target.value)
        this.setState({ ip: e.target.value })
    }

    onChangeSSHPort = (value) => {
        console.log("value = ", value)
        this.setState({ ssh_port: value === null ? 22 : value })
    }

    onChangeUserName = (e) => {
        this.setState({ user_name: e.target.value })
    }

    onChangePassword = (e) => {
        // console.log("e = ", e, ", value = ", e.target.value)
        this.setState({ password: e.target.value })
    }

    onChangeCenterIP = (e) => {
        this.setState({ center_ip: e.target.value })
    }

    onChangeAPIPort = (value) => {
        this.setState({ center_api_port: value === null ? 29080 : value })
    }

    onChangeDataPort = (value) => {
        // console.log("e = ", e, ", value = ", e.target.value)
        this.setState({ center_data_port: value === null ? 29090 : value })
    }

    onChangeExplanation = (e) => {
        this.setState({ explanation: e.target.value })
    }

    onChangePresetNodeID = (e) => {
        this.setState({ preset_node_id: e.target.value })
    }

    onSubmitForm = (e) => {
        if(string_is_empty(this.state.ip)){
            alert("IP 不能为空！");
            return;
        }

        if(string_is_empty(this.state.user_name)){
            alert("用户名不能为空！");
            return;
        }

        if(string_is_empty(this.state.password)){
            alert("口令不能为空！");
            return;
        }

        if(string_is_empty(this.state.center_ip)){
            alert("中心 IP 地址不能为空！");
            return;
        }

        let fetch_data = {
            ip: this.state.ip, 
            ssh_port: parseInt(this.state.ssh_port),
            user_name: this.state.user_name,
            password: this.state.password,
            explanation: this.state.explanation,
            preset_node_id: this.state.preset_node_id,
            center_ip: this.state.center_ip,
            center_api_port: parseInt(this.state.center_api_port),
            center_data_port: parseInt(this.state.center_data_port),
        }
        console.log("fetch_data = ", fetch_data)

        if(this.state.id === 0) {
            let url = APP_CONFIG.DOMAIN_URL + 'remote_machine'

            yyq_fetch(url, 'POST', data => {
                    this.setState({_active_key: ""})
                    this.props.onChange()
                }, (err_msg) => {
                    alert("提交失败: " + err_msg);
                }, fetch_data)
        } else {
            fetch_data["id"] = parseInt(this.state.id)
            let url = APP_CONFIG.DOMAIN_URL + 'remote_machine/' + this.state.id

            yyq_fetch(url, 'PUT', data => {
                this.setState({_active_key: "", id: 0, ip: ""})
                this.props.onChange()
            }, (err_msg) => {
                alert("提交失败: " + err_msg);
            }, fetch_data)
        }
    }

    render() {
        return (
            <Collapse accordion activeKey={this.state._active_key} onChange={this.onChangeActiveKey}
                expandIconPosition="right" expandIcon={({ isActive }) => <UpOutlined rotate={isActive ? 0 : 180} />} >
            <Panel header={0===this.state.id ? "添加远程机器" : "修改远程机器"} key="1">
                <Row gutter={[16, 124]}>
                    <Col span={12}><span className="tag_width">{RED_STAR}IP 地址：</span><Input value={this.state.ip} className="keep_tag" onChange={this.onChangeIP} /></Col>
                    <Col span={12}><span className="tag_width">{RED_STAR}ssh 端口：</span><InputNumber min={1} max={65535} value={this.state.ssh_port} onChange={this.onChangeSSHPort} /></Col>
                </Row><p/>

                <Row gutter={[16, 124]}>
                    <Col span={12}><span className="tag_width">{RED_STAR}用户名：</span><Input value={this.state.user_name} className="keep_tag" onChange={this.onChangeUserName} /></Col>
                    <Col span={12}><span className="tag_width">{RED_STAR}口令：</span><Input value={this.state.password} className="keep_tag" onChange={this.onChangePassword} /></Col>
                </Row><p/>

                <Row gutter={[16, 124]}>
                    <Col span={12}><span className="tag_width">{RED_STAR}中心 IP 地址：</span><Input value={this.state.center_ip} className="keep_tag" onChange={this.onChangeCenterIP} /></Col>
                    <Col span={6}><span className="tag_width">{RED_STAR}中心 API 端口：</span><InputNumber min={1} max={65535} value={this.state.center_api_port} onChange={this.onChangeAPIPort} /></Col>
                    <Col span={6}><span className="tag_width">{RED_STAR}中心数据端口：</span><InputNumber min={1} max={65535} value={this.state.center_data_port} onChange={this.onChangeDataPort} /></Col>
                </Row><p/>

                <Row gutter={[16, 124]}>
                    <Col span={24}><span className="tag_width">说明：</span><TextArea className="keep_tag" value={this.state.explanation} onChange={this.onChangeExplanation} /></Col>
                </Row><p/>

                <Row gutter={[16, 124]}>
                    <Col span={12}><span className="tag_width">预设置节点 ID：</span><Input className="keep_tag" value={this.state.preset_node_id} onChange={this.onChangePresetNodeID} /></Col>
                </Row><p/>

                <Button type="primary" onClick={this.onSubmitForm}>{0===this.state.id ? "添加" : "修改"}</Button>
            </Panel>
            </Collapse>
        )
    }
}

export default RemoteAdd;