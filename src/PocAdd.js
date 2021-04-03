import React from 'react';
import { Collapse, Space, Input, Button, Upload, Checkbox } from 'antd';
import { APP_CONFIG, RED_STAR, yyq_fetch, string_is_empty } from './public_fun.js';
import { UpOutlined, UploadOutlined } from '@ant-design/icons';

import './App.css';

const { Panel } = Collapse;
const { TextArea } = Input;

class PocAdd extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            err_msg: "",
            edit_name: "",
            is_set: 0,
            explanation: "",
            operator: "",
            upload_files: [],
            _active_key: "",
            _accept_type: ".py"
        };
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        console.log("getDerivedStateFromProps nextProps = ", nextProps, ", prevState = ", prevState)

        let new_state = null
        if(nextProps.edit_record) {
            if (nextProps.edit_record.name !== prevState.edit_name) {
                new_state = nextProps.edit_record
                new_state["edit_name"] = nextProps.edit_record.name
                new_state["_active_key"] = "1"
                new_state["upload_files"] = []
                new_state["_accept_type"] = nextProps.edit_record.is_set ? ".json" : ".py"
            } 
        } else if("" !== prevState.edit_name) {
            new_state = {"edit_name": ""}
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
            if(this.state.edit_name === "") {
                this.setState({ _active_key: "" })
            } else {
                this.props.onChange(true)
            }
        }
    }

    onChangePocName = (e) => {
        this.setState({ name: e.target.value })
    }

    onChangeIsSet = (e) => {
        console.log("e = ", e, ", is_set = ", Number(e.target.checked));
        this.setState({ 
            is_set: Number(e.target.checked),
            _accept_type: e.target.checked ? ".json" : ".py",
            upload_files : []
         })
    }

    onChangeExplanation = (e) => {
        this.setState({ explanation: e.target.value })
    }

    onChangePocOperator = (e) => {
        this.setState({ operator: e.target.value })
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
        let url = APP_CONFIG.DOMAIN_URL + 'upload_poc/'
        const formData = new FormData();

        formData.append("is_set", this.state.is_set);

        if(1 > this.state.upload_files.length){
            alert("请选择一个 POC 文件！");
            return;
        }
        formData.append("upload", this.state.upload_files[0].originFileObj);

        formData.append("explanation", this.state.explanation);
        formData.append("operator", this.state.operator);

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
            <Panel header={""===this.state.edit_name ? "添加POC" : "修改POC"} key="1">
                <Space>
                {RED_STAR}是否 POC 集：<Checkbox checked={this.state.is_set} onChange={this.onChangeIsSet} />
                </Space><p /><Space>
                说明：<TextArea style={{ width: 600 }} value={this.state.explanation} onChange={this.onChangeExplanation} />
                </Space><p /><Space>
                POC脚本作者：<Input value={this.state.operator} style={{ width: 300 }} onChange={this.onChangePocOperator} />
                </Space><p /><Space>

                {RED_STAR}<Upload accept={this.state._accept_type} fileList={this.state.upload_files} beforeUpload={this.handleBeforeUpload} onChange={this.onSelectFile}>
                            <Button icon={<UploadOutlined />}>选择 POC 文件</Button>
                        </Upload>
                </Space><p /><Space>
                <Button type="primary" onClick={this.onSubmitForm}>{""===this.state.edit_name ? "添加" : "修改"}</Button>
                </Space>
            </Panel>
            </Collapse>
        )
    }
}

export default PocAdd;