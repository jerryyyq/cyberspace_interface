import React from 'react';
import { Layout, Table, Card, Row, Col, Input, Select, Button, Skeleton } from 'antd';
import { APP_CONFIG, RED_STAR, yyq_fetch, string_is_empty } from './public_fun.js';
import DataDetail from './DataDetail.js';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

import './App.css';

const { Option } = Select;
const { TextArea } = Input;

class ContentFofaSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_page: 0,
            err_msg: "",
            search_str: "",
            field_name: "protocol",
            operator: "==",
            field_value: "",
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

    onChangeFieldName = (value) => {
        this.setState({ field_name: value })
    }
    
    onChangeOperator = (value) => {
        this.setState({ operator: value })
    }

    onChangeFieldValue = (e) => {
        this.setState({ field_value: e.target.value })
    }

    onAddSearchData = (e) => {
        if(string_is_empty(this.state.field_name)){
            alert("请先选择检索字段");
            return;
        }
        if(string_is_empty(this.state.field_value)){
            alert("请输入检索值");
            return;
        }

        let add_search = this.state.field_name + this.state.operator + this.state.field_value
        if(-1 < this.state.search_str.indexOf(add_search)) {
            alert("不要重复添加");
            return;
        }

        if(!string_is_empty(this.state.search_str)){
            add_search = this.state.search_str + ',\n' + add_search
        }

        this.setState({ search_str: add_search})
    }
    
    onChangeSearchStr = (e) => {
        this.setState({ search_str: e.target.value })
    }

    onFind = (e) => {
        if(string_is_empty(this.state.search_str)){
            alert("检索内容不能为空！");
            return;
        }

        let url = APP_CONFIG.DOMAIN_URL + "data_search";

        yyq_fetch(url, 'POST', 
            (data) => {
                this.setState({
                    search_data: data.result
                })
            }, 
            (err_msg) => {
                alert(err_msg)
            },
            this.state.search_str
        )
    }

    onEnterKeyPress = (e)=> {
        console.log("onkeydown, e = ", e)
		if (e.which === 13) {
			this.onFind()
		}
	}

    componentDidMount() {
        this.getDataSummary()
    }

    render() {
        let columns = []
        if(this.state.search_data.length > 0) {
            let item0 = this.state.search_data[0]
            for(let key in item0) {
                columns.push({title:key, dataIndex:key, key:key})
            } 
        }    

        if(this.state.err_msg !== "") {
            return (
                <Layout.Content key="1">
                    <h1>数据检索</h1>
                    {this.state.err_msg}
                </Layout.Content>
            );
        } else {
            // {"country":[{"count":1041,"country":"中国"},{"count":3,"country":"美国"},{"count":1,"country":"局域网"}]}
            let summary_country = []
            if("country" in this.state.summary_data) {
                summary_country = this.state.summary_data.country
            }

            let field_name = ["protocol","app","title","server","header","cert_subject","port","ip","scan_time"]
            let operator = ["==", "!=", "="]

            return (
                <Layout.Content key="1" >
                    <h2>数据检索</h2>
                    <div className="Content">
                    <Row>
                        <Col span={6}>
                            <Card title="地区" bordered={true}>
                                <Skeleton loading={1 > Object.keys(this.state.summary_data).length} active />
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
                                <Col>
                                    <span className="tag_width">检索字段：</span>
                                    <Select style={{width:"120px"}} defaultValue={this.state.field_name} onChange={this.onChangeFieldName}>
                                        {field_name.map((item, index) => {
                                            return <Option value={item} key={item}>{item}</Option>
                                        })}
                                    </Select>
                                </Col>
                                <Col>
                                    <Select defaultValue={this.state.operator} onChange={this.onChangeOperator}>
                                        {operator.map((item, index) => {
                                            return <Option value={item} key={item}>{item}</Option>
                                        })}
                                    </Select>
                                </Col>
                                <Col span={10}>
                                    <Input value={this.state.field_value} onChange={this.onChangeFieldValue} />
                                </Col>
                                <Col span={1} >
                                    <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={this.onAddSearchData} />
                                </Col>
                                <Col span={1} />
                            </Row>
                            <Row gutter={[16, 124]}><Col span={1} /><Col>检索条件：</Col></Row>
                            <Row gutter={[16, 124]}>
                                <Col span={1} />
                                <Col span={22}>
                                <TextArea rows={4} value={this.state.search_str} prefix={<SearchOutlined />} 
                                        onChange={this.onChangeSearchStr} onKeyPress={this.onEnterKeyPress}/>
                                </Col>
                                <Col span={1} />
                            </Row>
                            <Row gutter={[16, 124]} className="column_right">
                                <Col span={1} />
                                <Col span={22}><Button type="primary" onClick={this.onFind}>检索</Button></Col>
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