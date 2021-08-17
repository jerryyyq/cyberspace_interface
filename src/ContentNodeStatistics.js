import React from 'react';
import { Layout, Table, Card, Row, Col, Input, Select, Button } from 'antd';
import { APP_CONFIG, RED_STAR, yyq_fetch, get_local_stroage_value, set_local_stroage_value, string_is_empty } from './public_fun.js';
import DataDetail from './DataDetail.js';

import './App.css';

const { Option } = Select;

const KEY_NAME_NODE_LIST = "_ls_node_list"

class ContentNodeStatistics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_page: 0,
            err_msg: "",
            node_id: "",
            task_id: "",
            node_list: [],
            task_statistics_list: []
        };
    }

    onChangeNode = (value) => {
        this.setState({ node_id: value })
    }

    onChangeTaskID = (e) => {
        this.setState({ task_id: e.target.value })
    }

    fetchAllNodeList = () => {
        let url = APP_CONFIG.DOMAIN_URL + "node_list";

        yyq_fetch(url, 'GET', 
            (data) => {
                this.setState({
                    node_list: data.node_list,
                    node_id: data.node_list[0]["node_id"]
                })

                set_local_stroage_value(KEY_NAME_NODE_LIST, data.node_list)
            }, 
            (err_msg) => {
                this.setState({
                    err_msg: err_msg
                })
            }
        )
    }

    onFind = (e) => {
        if(string_is_empty(this.state.node_id)){
            alert("node_id 不能为空！");
            return;
        }

        let url = APP_CONFIG.DOMAIN_URL + "node_task_statistics/" + this.state.node_id;
        if(!string_is_empty(this.state.task_id)){
            url = url + "/" + this.state.task_id
        }

        yyq_fetch(url, 'GET', 
            (data) => {
                this.setState({
                    task_statistics_list: data["node_list"]
                })
            }, 
            (err_msg) => {
                alert(err_msg)
            }
        )
    }

    componentDidMount() {
        let ls_value = get_local_stroage_value(KEY_NAME_NODE_LIST)
        if(ls_value === null) {
            this.fetchAllNodeList()
        } else {
            this.setState({
                node_list: ls_value,
                node_id: ls_value[0]["node_id"]
            })
        }
    }
  
    componentWillUnmount() {
    }

    render() {
        const columns = [
            {
              title: '索引',
              dataIndex: 'id',
              key: 'id',
              render: (text, record) => DataDetail(text, record),
            },
            {
              title: '节点 ID',
              dataIndex: 'node_id',
              key: 'node_id',
            },
            {
                title: '任务 ID',
                dataIndex: 'task_id',
                key: 'task_id',
            },
            {
              title: '执行的子任务数',
              dataIndex: 'sub_task_count',
              key: 'sub_task_count',
            },
            {
                title: '更新时间',
                dataIndex: 'update_time',
                key: 'update_time',
            },
        ];

        if(this.state.err_msg !== "") {
            return (
                <Layout.Content key="1">
                    <h1>节点子任务统计</h1>
                    {this.state.err_msg}
                </Layout.Content>
            );
        } else {
            let live_node = this.state.node_list.filter(
                item => {
                    // console.log("item = ", item)
                    return 0 === parseInt(item["is_died"]);
                }
            )
            console.log("this.state.node_id = ", this.state.node_id)
            // console.log("live_node = ", live_node)
            live_node = this.state.node_list

            return (
                <Layout.Content key="1">
                    <h2>节点子任务统计</h2>
                    <div className="Content">

                    <Row gutter={[16, 24]}>
                        <Col span={1} />
                        <Col span={22}><span className="tag_width">{RED_STAR}节点 ID：</span>
                        <Select defaultValue={this.state.node_id} style={{width:"500px"}} onChange={this.onChangeNode}>
                            {Array.from(live_node, (e, i) => {
                                return <Option value={e["node_id"]} key={e["node_id"]}>{e["node_id"]}</Option>
                            })}
                        </Select></Col>
                    </Row><p/>

                    <Row gutter={[16, 124]}>
                        <Col span={1} />
                        <Col span={22}><span className="tag_width">任务 ID：</span><Input value={this.state.task_id} className="keep_tag" onChange={this.onChangeTaskID} /></Col>
                    </Row><p/>

                    <Row gutter={[16, 124]}>
                        <Col span={21} />
                        <Col span={1}><Button type="primary" onClick={this.onFind}>查找</Button></Col>
                    </Row><p/>

                    <Card title="节点子任务统计列表">
                    <Table dataSource={this.state.task_statistics_list} columns={columns} />
                    </Card>
                    </div>
                </Layout.Content>
            );
        }

    }
}

export default ContentNodeStatistics;