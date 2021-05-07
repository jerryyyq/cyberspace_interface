import React from 'react';
import { Collapse, Space, Input, Button } from 'antd';
import { APP_CONFIG, RED_STAR, yyq_fetch, string_is_empty } from './public_fun.js';
import ReactJson from 'react-json-view'
import { UpOutlined } from '@ant-design/icons';

import './App.css';

const { Panel } = Collapse;

class WeakPasswordAdd extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            err_msg: "",
            edit_name: "",
            name: "",
            data: {},
            _active_key: ""
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log("getDerivedStateFromProps nextProps = ", nextProps, ", prevState = ", prevState)

        let new_state = null
        if(nextProps.edit_name) {
            if (nextProps.edit_name !== prevState.edit_name) {
                new_state = {edit_name: nextProps.edit_name, name: nextProps.edit_name}
                new_state["_active_key"] = "1"
                new_state["data"] = nextProps.edit_data
            } 
        } else if("" !== prevState.edit_name) {
            new_state = {"edit_name": ""}
            new_state["_active_key"] = ""
        }

        console.log("new_state = ", new_state)
        return new_state
    }

    onChangeActiveKey = (key) => {
        console.log("key = ", key);

        if (key === "1") {
            this.setState({ _active_key: key })
        } else {
            if(this.state.edit_name === "") {
                this.setState({ _active_key: "" })
            } else {
                this.props.onChange(true)
            }
        }
    }

    onChangeWeakPasswordName = (e) => {
        this.setState({ name: e.target.value })
    }

    onJsonEdit = (e) => {
        console.log("json edit callback", e)
        if (e.new_value === "error") {
            return false
        }

        this.setState({ data: e.updated_src });
    }

    onJsonAdd = (e) => {
        console.log("json add callback", e)
        if (e.new_value === "error") {
            return false
        }

        this.setState({ data: e.updated_src });
    }

    onJsonDelete = (e) => {
        console.log("json delete callback", e)
        this.setState({ data: e.updated_src });
    }

    onSubmitForm = (e) => {
        let url = APP_CONFIG.DOMAIN_URL + 'weak_password/' + this.state.name

        if(string_is_empty(this.state.name)){
            alert("名称不能为空！");
            return;
        }

        if (Object.keys(this.state.data).length === 0) {
            alert("内容不能为空！");
            return;
        }

        yyq_fetch(url, 'POST', 
            data => {
                this.setState({_active_key: ""})
                this.props.onChange()
            }, 
            err_msg => {
                alert("提交失败: " + err_msg);
            }, 
            JSON.stringify(this.state.data)
        )
    }

    render() {
        return (
            <Collapse accordion activeKey={this.state._active_key} onChange={this.onChangeActiveKey}
                expandIconPosition="right" expandIcon={({ isActive }) => <UpOutlined rotate={isActive ? 0 : 180} />} >
            <Panel header={""===this.state.edit_name ? "添加弱口令模板" : "修改弱口令模板"} key="1">
                <Space>
                {RED_STAR}弱口令模板名称：<Input value={this.state.name} style={{ width: 300 }} onChange={this.onChangeWeakPasswordName} />
                </Space><p /><Space>
                {RED_STAR}弱口令模板内容：<ReactJson src={this.state.data} displayObjectSize={false} displayDataTypes={false} 
                onEdit={this.onJsonEdit} onAdd={this.onJsonAdd} onDelete={this.onJsonDelete} />
                </Space><p /><Space>
                <Button type="primary" onClick={this.onSubmitForm}>{""===this.state.edit_name ? "添加" : "修改"}</Button>
                </Space>
            </Panel>
            </Collapse>
        )
    }
}

export default WeakPasswordAdd;