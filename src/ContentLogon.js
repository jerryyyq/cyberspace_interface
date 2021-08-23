import React from 'react';
import { Input, Button, Row, Col } from 'antd';
import { APP_CONFIG, yyq_fetch, RED_STAR, string_is_empty } from './public_fun.js';

import './App.css';


class ContentLogon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_name: "",
            password: "",
            err_msg: "",
        };
    }

    onChangeUserName = (e) => {
        // console.log("e = ", e, ", value = ", e.target.value)
        this.setState({ user_name: e.target.value })
    }

    onChangePassword = (e) => {
        this.setState({ password: e.target.value })
    }

    onSubmitForm = (e) => {
        if(string_is_empty(this.state.user_name)){
            alert("用户名不能为空！");
            return;
        }

        /*
        if(string_is_empty(this.state.password)){
            alert("口令不能为空！");
            return;
        }
        */

        let fetch_data = {
            user_name: this.state.user_name,
            password: this.state.password,
        }
        console.log("fetch_data = ", fetch_data)

        yyq_fetch(APP_CONFIG.LOGON_URL, 'POST', data => {
                this.props.onLogon(1, this.state.user_name)
            }, (err_msg) => {
                alert("登录失败: " + err_msg);
            }, JSON.stringify(fetch_data)
        )
    }

    onkeydown = (e)=> {
		if (e.keyCode === 13) {
			this.onSubmitForm()
		}
	}

    componentDidUpdate(){
		document.addEventListener('keydown', this.onkeydown);
	}

    render() {
        return (
            <div>
            
            <Row type="flex" justify="center" align="middle">
            <Col span={8}><span className="tag_width">{RED_STAR}用户名：</span><Input className="keep_tag" value={this.state.user_name} onChange={this.onChangeUserName} /></Col>
            </Row>
            
            <Row type="flex" justify="center" align="middle">
            <Col span={8}><span className="tag_width">{RED_STAR}密码：</span><Input.Password className="keep_tag" value={this.state.password} onChange={this.onChangePassword} /></Col>
            </Row>

            <Row type="flex" justify="center" align="middle">
            <Col span={8}><div style={{'text-align':'right'}}><Button type="primary" onClick={this.onSubmitForm}>登录</Button></div></Col>
            </Row>
            </div>
        );
    }
}


export default ContentLogon;