import React from 'react';
import { Collapse, Space, Input, Button, Upload } from 'antd';
import { APP_CONFIG, RED_STAR, yyq_fetch, string_is_empty } from './public_fun.js';
import { UpOutlined, UploadOutlined } from '@ant-design/icons';

import './App.css';

const { Panel } = Collapse;

class FingerAdd extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            err_msg: "",
            id: 0,
            finger_name: "",
            upload_files: [],
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
                new_state["upload_files"] = []
            } 
        } else if(0 !== prevState.id) {
            new_state = {"id": 0}
            new_state["_active_key"] = ""
            new_state["upload_files"] = []
        }

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

    onChangeFingerName = (e) => {
        this.setState({ finger_name: e.target.value })
    }

    handleBeforeUpload = (file) => {
        return false
    }

    onSelectFile = (info) => {
        console.log(info);
        let fileList = [...info.fileList];
        fileList = fileList.slice(-1);

        this.setState({ upload_files: fileList });
    }

    onSubmitForm = (e) => {
        let url = APP_CONFIG.DOMAIN_URL + 'upload_finger/' + this.state.id
        const formData = new FormData();

        if(string_is_empty(this.state.finger_name)){
            alert("指纹名称不能为空！");
            return;
        }
        formData.append("finger_name", this.state.finger_name);

        if(1 > this.state.upload_files.length){
            alert("请选择一个指纹压缩文件！");
            return;
        }
        formData.append("upload", this.state.upload_files[0].originFileObj);

        if(this.state.id > 0) {
            formData.append("finger_id", this.state.id);
        }

        console.log("formData = ", formData)

        yyq_fetch(url, 'POST', 
            data => {
                this.setState({_active_key: ""})
                this.props.onChange()
            }, 
            err_msg => {
                alert("提交失败: " + err_msg);
            }, 
            formData
        )
    }

    render() {
        return (
            <Collapse accordion activeKey={this.state._active_key} onChange={this.onChangeActiveKey}
                expandIconPosition="right" expandIcon={({ isActive }) => <UpOutlined rotate={isActive ? 0 : 180} />} >
            <Panel header={0===this.state.id ? "添加指纹" : "修改指纹"} key="1">
                <Space>
                {RED_STAR}指纹名称：<Input value={this.state.finger_name} style={{ width: 300 }} onChange={this.onChangeFingerName} />
                </Space><p /><Space>
                {RED_STAR}<Upload accept=".zip" fileList={this.state.upload_files} beforeUpload={this.handleBeforeUpload} onChange={this.onSelectFile}>
                            <Button icon={<UploadOutlined />}>选择指纹压缩文件</Button>
                        </Upload>
                </Space><p /><Space>
                <Button type="primary" onClick={this.onSubmitForm}>{0===this.state.id ? "添加" : "修改"}</Button>
                </Space>
            </Panel>
            </Collapse>
        )
    }
}

export default FingerAdd;