import React from 'react';
import { Layout, Input, Button, Row, Col } from 'antd';
import { yyq_fetch, RED_STAR, string_is_empty } from './public_fun.js';

import './App.css';

const { Content } = Layout;

class ContentPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            old_password: "",
            new_password1: "",
            new_password2: "",
            err_msg: "",
        };
    }

    onChangeOldPassword = (e) => {
        this.setState({ old_password: e.target.value })
    }

    onChangeNewPassword1 = (e) => {
        this.setState({ new_password1: e.target.value })
    }

    onChangeNewPassword2 = (e) => {
        this.setState({ new_password2: e.target.value })
    }

    onSubmitForm = (e) => {
        if(this.state.new_password1 !== this.state.new_password2){
            alert("您如入的密码不一致！");
            return;
        }

        if(string_is_empty(this.state.new_password1)){
            alert("新密码不能为空！");
            return;
        }

        /*
        if(string_is_empty(this.state.old_password)){
            alert("旧口令不能为空！");
            return;
        }
        */

        let fetch_data = {
            user_name: this.props.user,
            old_password: this.state.old_password,
            new_password: this.state.new_password1,
        }
        console.log("fetch_data = ", fetch_data)

        console.log("window.location = ", window.location, ", location.hostname = ", window.location.hostname)
        let url = window.location.href + "user/change_password/"
        // let url = "http://192.168.205.180:29080/user/change_password"
        console.log("url = ", url)

        yyq_fetch(url, 'POST', data => {
                alert("口令修改成功");
            }, (err_msg) => {
                alert("口令修改失败: " + err_msg);
            }, fetch_data
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
            <Content>
                <div style={{padding:100}}>
                <Row type="flex" justify="center" align="middle">
                <Col span={12}><span className="tag_width" style={{'text-align':'left'}}>{RED_STAR}原密码：</span><Input.Password className="keep_tag" value={this.state.old_password} onChange={this.onChangeOldPassword} /></Col>
                </Row>
                
                <Row type="flex" justify="center" align="middle">
                <Col span={12}><span className="tag_width" style={{'text-align':'left'}}>{RED_STAR}新密码：</span><Input.Password className="keep_tag" value={this.state.new_password1} onChange={this.onChangeNewPassword1} /></Col>
                </Row>
                
                <Row type="flex" justify="center" align="middle">
                <Col span={12}><span className="tag_width" style={{'text-align':'left'}}>{RED_STAR}重输密码：</span><Input.Password className="keep_tag" value={this.state.new_password2} onChange={this.onChangeNewPassword2} /></Col>
                </Row>

                <Row type="flex" justify="center" align="middle">
                <Col span={12}><div style={{'text-align':'right'}}><Button type="primary" onClick={this.onSubmitForm}>保存更改</Button></div></Col>
                </Row>
                </div>
            </Content>
        );
    }
}


export default ContentPassword;