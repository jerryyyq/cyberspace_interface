import React from 'react';
import { Layout, Table, Card, Tooltip, Space } from 'antd';
import { APP_CONFIG, yyq_fetch, get_local_stroage_value, set_local_stroage_value } from './public_fun.js';
import JsonDetail from './JsonDetail.js';
import WeakPasswordAdd from './WeakPasswordAdd.js';
import { ReloadOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';

import './App.css';

const KEY_NAME_WEAK_PASSWORD_LIST = "_ls_weak_password_list"
const KEY_NAME_WEAK_PASSWORD = "_ls_weak_password_"

class ContentStrategy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_page: 0,
            err_msg: "",
            weak_password_list: [],
            edit_name: ""
        };
    }

    fetchAllWeakPasswordList = () => {
        let url = APP_CONFIG.DOMAIN_URL + "weak_password_list";

        yyq_fetch(url, 'GET', 
            (data) => {
                this.setState({
                    weak_password_list: data.weak_password_list
                })

                data.weak_password_list.forEach(item => {
                    console.log("item = ", item)
                    this.fetchOneWeakPasswordInfo(item.name)
                })

                set_local_stroage_value(KEY_NAME_WEAK_PASSWORD_LIST, data.weak_password_list)
            }, 
            (err_msg) => {
                this.setState({
                    err_msg: err_msg
                })
            }
        )
    }

    fetchOneWeakPasswordInfo = (name) => {
        let url = APP_CONFIG.DOMAIN_URL + "weak_password/" + name;
        yyq_fetch(url, 'GET', 
        (data) => {
            console.log("data[name] = ", data[name])
            this.setState({
                ['_wp_' + name]: data[name]
            })

            set_local_stroage_value(KEY_NAME_WEAK_PASSWORD + name, data[name])
        }, 
        (err_msg) => {
            console.log("fetchOneWeakPasswordInfo(" + name + "), err_msg = ", err_msg)
            this.setState({
                err_msg: err_msg
            })
        })
    }

    onWeakPasswordAddChange = (cancel_edit) => {
        if(!cancel_edit) {
            this.fetchAllWeakPasswordList()
        }

        this.setState({edit_name: ""})
    }

    onEditStrategy = (record, e) => {
        console.log("onEditStrategy, record = ", record, ", e = ", e)
        this.setState({edit_name: record.name})
    }

    componentDidMount() {
        let ls_value = get_local_stroage_value(KEY_NAME_WEAK_PASSWORD_LIST)
        if(ls_value === null) {
            this.fetchAllWeakPasswordList()
        } else {
            this.setState({weak_password_list: ls_value})

            ls_value.forEach(item => {
                ls_value = get_local_stroage_value(KEY_NAME_WEAK_PASSWORD + item.name)
                if(ls_value === null) {
                    this.fetchOneWeakPasswordInfo(item.name)
                } else {
                    this.setState({
                        ['_wp_' + item.name]: ls_value
                    })
                }
            })
        }
    }
  
    componentWillUnmount() {
    }

    render() {
        const columns = [
            {
              title: '名称',
              dataIndex: 'name',
              key: 'name',
              render: (text, record) => JsonDetail(text, this.state["_wp_" + text]),
            },
            {
                title: 'md5',
                dataIndex: 'md5',
                key: 'md5',
            },
            {
                title: '更新时间',
                dataIndex: 'modify_time',
                key: 'modify_time',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <Space>
                    <a onClick={e => {this.onEditStrategy(record, e)}}><Tooltip title='修改'><EditOutlined style={{ color: 'orange' }} /></Tooltip></a>
                    <a href={APP_CONFIG.DOMAIN_URL + "finger_download/" + record.finger_zip_file}><Tooltip title='下载'><DownloadOutlined style={{ color: 'deepskyblue' }} /></Tooltip></a>
                    </Space>
                ),
            },
        ];


        if(this.state.err_msg !== "") {
            return (
                <Layout.Content>
                    <h1>弱口令管理</h1>
                    {this.state.err_msg}
                </Layout.Content>
            );
        } else {
            return (
                <Layout.Content>
                    <h2>弱口令管理</h2>
                    <div className="Content">
                    <WeakPasswordAdd edit_name={this.state.edit_name} edit_data={this.state['_wp_' + this.state.edit_name]} onChange={this.onWeakPasswordAddChange} /><br />

                    <Card title="弱口令模板列表" extra={<ReloadOutlined style={{ color: 'blue' }} onClick={this.fetchAllWeakPasswordList}/>}>
                    <Table dataSource={this.state.weak_password_list} columns={columns} />
                    </Card>
                    </div>
                </Layout.Content>
            );
        }

    }
}

export default ContentStrategy;