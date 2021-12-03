import React from 'react';
import { Layout, Table, Card, Row, Col, Input, Select, Button, Skeleton } from 'antd';
import { APP_CONFIG, RED_STAR, yyq_fetch, string_is_empty } from './public_fun.js';
import DataDetail from './DataDetail.js';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

import { Scene, PointLayer, HeatmapLayer } from "@antv/l7";
import { Mapbox, GaodeMap } from "@antv/l7-maps";
import { WorldLayer } from '@antv/l7-district';

import { MapboxScene } from '@antv/l7-react';

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

        this.scene = null;
        this.worldLayer = null;
    }

    getDataSummary = () => {
        let url = APP_CONFIG.DOMAIN_URL + "data_summary";

        yyq_fetch(url, 'GET', 
            (data) => {
                this.setState({
                    summary_data: data.data_summary
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

        const scene = new Scene({
            id: "hot_map",
            logoVisible: false,
            map: new Mapbox({
                pitch: 0,
                style: "dark",
                center: [116.2825, 39.9],
                zoom: 0,
                minZoom: 0,
                maxZoom: 24
            })
        });

        scene.on('loaded', () => {
            this.worldLayer = new WorldLayer(scene, {
                data: [],
                fill: {
                    color: {
                        field: 'NAME_CHN',
                        values: [
                            '#feedde',
                            '#fdd0a2',
                            '#fdae6b',
                            '#fd8d3c',
                            '#e6550d',
                            '#a63603'
                        ]
                    }
                },
                stroke: '#ccc',
                label: {
                    enable: true,
                    textAllowOverlap: false,
                    field: 'NAME_CHN'
                },
                popup: {
                    enable: false,
                    Html: props => {
                        return `<span>${props.NAME_CHN}</span>`;
                    }
                }
            });
        });

        console.log("scene.getSize() = ", scene.getSize())
        console.log("scene.getContainer() = ", scene.getContainer())
        this.worldLayer.fillLayer.fitBounds()
      
        this.scene = scene;        
    }

    componentWillUnmount() {
        this.scene.destroy();
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
            /*
            const scene = new Scene({
                id: "hot_map",
                logoVisible: false,
                map: new Mapbox({
                    pitch: 0,
                    style: "dark",
                    center: [116.2825, 39.9],
                    zoom: -10,
                    minZoom: -100,
                    maxZoom: 100
                })
            });

            scene.on('loaded', () => {
                new WorldLayer(scene, {
                    data: [],
                    fill: {
                        color: {
                            field: 'NAME_CHN',
                            values: [
                                '#feedde',
                                '#fdd0a2',
                                '#fdae6b',
                                '#fd8d3c',
                                '#e6550d',
                                '#a63603'
                            ]
                        }
                    },
                    stroke: '#ccc',
                    label: {
                        enable: true,
                        textAllowOverlap: false,
                        field: 'NAME_CHN'
                    },
                    popup: {
                        enable: false,
                        Html: props => {
                            return `<span>${props.NAME_CHN}</span>`;
                        }
                    }
                });
            });
            
            fetch(
                "https://gw.alipayobjects.com/os/basement_prod/c02f2a20-9cf8-4756-b0ad-a054a7046920.csv"
            )
            .then(res => res.text())
            .then(data => {
                const pointLayer = new PointLayer({})
                .source(data, {
                    parser: {
                        type: "csv",
                        x: "Long",
                        y: "Lat"
                    }
                })
                .size(0.6)
                .color("#ffa842")
                .style({
                    opacity: 1
                });
              
                scene.addLayer(pointLayer);
            });

              
            fetch(
                "https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json"
            )
            .then(res => res.json())
            .then(data => {
                const layer = new HeatmapLayer({zIndex: 2})
                .source(data).size('mag', [0, 1.0]) // weight映射通道
                .style({
                    intensity: 2,
                    radius: 30,
                    opacity: 1.0,
                    rampColors: {
                        colors: ['#2E8AE6', '#69D1AB', '#DAF291', '#FFD591', '#FF7A45', '#CF1D49'],
                        positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0]
                    }
                })
              
                scene.addLayer(layer);
            });
            */



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
                            {/*
                            <MapboxScene option={{logoVisible: false}} map={{
                                style: 'light',
                                center: [112, 20],
                                token: '',
                            }}>
                                <WorldLayer key={'2'} data={[]} fill={{color:{
                                        field: 'NAME_CHN',
                                        values: ['#feedde','#fdd0a2','#fdae6b','#fd8d3c','#e6550d','#a63603']
                                    }}} stroke={'#ccc'} label={{
                                        enable: true,
                                        textAllowOverlap: false,
                                        field: 'NAME_CHN'
                                    }} popup={{
                                        enable: false,
                                        Html: props => {
                                            return `<span>${props.NAME_CHN}</span>`;
                                        }
                                    }}
                                />
                            </MapboxScene>
                            */}
                            <div id="hot_map" style={{minHeight:'100px', justifyContent:'center', position:'relative', height:0, paddingBottom:'100%'}}/>

                            <Card title="地区" bordered={true}>
                                <Skeleton loading={1 > Object.keys(this.state.summary_data).length} active />
                                {Array.from(summary_country, (e, i) => {
                                    return <Row><Col span={12}> {e["country"]}: </Col><Col span={12}>{e["count"]} 个</Col></Row>
                                })}
                            </Card>

                            {/*
                            <MapboxScene option={{}} map={{
                                style: 'dark',
                                center: [112, 20],
                                token: '',
                            }} />
                            */}

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