import React from 'react';
import { Collapse, Input, Button, Row, Col, Table } from 'antd';
import { RED_STAR, string_is_empty } from './public_fun.js';
import { UpOutlined } from '@ant-design/icons';
import ReactJson from 'react-json-view'

import './App.css';

const { Panel } = Collapse;

class ResultFind extends React.Component {
    constructor(props) {
        console.log("props = ", props)
        super(props);

        this.state = {
            err_msg: "",
            ip: "",
            find_list: [],
            _active_key: ""
        };
    }

    onChangeActiveKey = (key) => {
        console.log("key = ", key);

        if (key === "1") {
            this.setState({ _active_key: key })
        } else {
            this.setState({ _active_key: "" })
        }
    }

    onChangeIP = (e) => {
        // console.log("e = ", e, ", value = ", e.target.value)
        this.setState({ ip: e.target.value })
    }

    onFind = (e) => {
        let new_find_list = [];
        if(!string_is_empty(this.state.ip))
        {
            let key_ip_arr = this.state.ip.replace(/[ ]/g, "").split( ',' );
            console.log("key_ip_arr = ", key_ip_arr)

            new_find_list = this.props.result_list.filter((item) => {
                return key_ip_arr.includes(item["ip"]);
            })
        }

        this.setState({
            find_list: new_find_list
        })
    }

    render() {
        let SHOW_FIND;
        if(this.state.find_list.length > 0)
        {
            const columns = [
                {
                    title: 'IP',
                    dataIndex: 'ip',
                    key: 'ip',
                },
                {
                    title: '数据',
                    dataIndex: 'data',
                    key: 'data',
                    render: (text, record) => <ReactJson src={record} displayObjectSize={false} displayDataTypes={false} />,
                },
            ];

            SHOW_FIND = <Table dataSource={this.state.find_list} columns={columns} />
        }

        return (
            <Collapse accordion activeKey={this.state._active_key} onChange={this.onChangeActiveKey}
                expandIconPosition="right" expandIcon={({ isActive }) => <UpOutlined rotate={isActive ? 0 : 180} />} >
            <Panel header="查找" key="1">
                <Row gutter={[16, 124]}>
                    <Col span={24}><span className="tag_width">{RED_STAR}IP 地址：</span><Input value={this.state.ip} className="keep_tag" onChange={this.onChangeIP} /></Col>
                </Row><p/>

                <Row gutter={[16, 124]}>
                    <Col span={24}>{ SHOW_FIND }</Col>
                </Row><p/>

                <Button type="primary" onClick={this.onFind}>查找</Button>
            </Panel>
            </Collapse>
        )
    }
}

export default ResultFind;