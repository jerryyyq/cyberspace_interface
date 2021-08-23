import React from 'react';
import { Layout, Table, Card, Row, Col, Input, Select, Button, Skeleton } from 'antd';
import { APP_CONFIG, RED_STAR, yyq_fetch, string_is_empty } from './public_fun.js';
import DataDetail from './DataDetail.js';
import { SearchOutlined } from '@ant-design/icons';

import './App.css';

const { Option } = Select;

class ContentFofaSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_page: 0,
            err_msg: "",
            search_str: "",
            summary_data: {},
            search_data: []
        };
    }

    getDataSummary = () => {
        let url = APP_CONFIG.DOMAIN_URL + "data_summary";

        yyq_fetch(url, 'GET', 
            (data) => {
                this.setState({
                    summary_data: data.result
                })
            }, 
            (err_msg) => {
                this.setState({
                    err_msg: err_msg
                })
            }
        )
    }

    onChangeSearchStr = (e) => {
        this.setState({ search_str: e.target.value })
    }

    onFind = (e) => {
        if(string_is_empty(this.state.search_str)){
            alert("检索内容不能为空！");
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

    onkeydown = (e)=> {
		if (e.keyCode === 13) {
			this.onSubmitForm()
		}
	}

    componentDidUpdate() {
		document.addEventListener('keydown', this.onFind);
	}

    componentDidMount() {
        this.getDataSummary()
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
                    <h1>数据检索</h1>
                    {this.state.err_msg}
                </Layout.Content>
            );
        } else {
            // {"country":[{"count":1041,"country":"中国"},{"count":3,"country":"美国"},{"count":1,"country":"局域网"}]}
            var summary_country = []
            if("country" in this.state.summary_data) {
                summary_country = this.state.summary_data.country
            }

            return (
                <Layout.Content key="1">
                    <h2>数据检索</h2>
                    <div className="Content">
                    <Row>
                        <Col span={6}>
                            <Skeleton loading={1 > Object.keys(this.state.summary_data).length} active />

                            <Card title="地区" bordered={true}>
                                {Array.from(summary_country, (e, i) => {
                                    return <Row><Col span={12}> {e["country"]}: </Col><Col span={12}>{e["count"]} 个</Col></Row>
                                })}
                            </Card>

                            <Card title="Card title">
                                <p>Card content</p>
                                <p>Card content</p>
                                <p>Card content</p>
                            </Card>

                            <Card title="Card title">
                                <p>Card content</p>
                                <p>Card content</p>
                                <p>Card content</p>
                            </Card>
                        </Col>

                        <Col span={18}>
                            <Row gutter={[16, 124]}>
                                <Col span={1} />
                                <Col span={19}><span className="tag_width">检索条件：</span>
                                <Input value={this.state.search_str} className="keep_tag" prefix={<SearchOutlined />} onChange={this.onChangeSearchStr} />
                                </Col>
                                <Col><Button type="primary" onClick={this.onFind}>检索</Button></Col>
                                <Col span={1} />
                            </Row><p/>

                            <Card title="检索结果列表">
                                <Table dataSource={this.state.search_data} columns={columns} />
                            </Card>
                        </Col>
                    </Row>


                    </div>
                </Layout.Content>
            );
        }

    }
}

export default ContentFofaSearch;