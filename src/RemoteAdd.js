import React from 'react';
import { Collapse, Space, Input, Select, Tabs, Button, Upload } from 'antd';
import { APP_CONFIG, yyq_fetch, string_is_empty } from './public_fun.js';
import { UpOutlined, UploadOutlined } from '@ant-design/icons';

import './App.css';

const { Panel } = Collapse;
const { Option } = Select;
const { TabPane } = Tabs;

class RemoteAdd extends React.Component {
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

    onChangeActiveKey = (key) => {
        console.log("key = ", key);
        this.setState({ _active_key: key })
    }

    render() {
        return (
            <Collapse defaultActiveKey={['1']} activeKey={this.state._active_key} onChange={this.onChangeActiveKey}
                expandIconPosition="right" expandIcon={({ isActive }) => <UpOutlined rotate={isActive ? 0 : 180} />} >
            <Panel header="添加远程机器" key="1">
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

export default RemoteAdd;