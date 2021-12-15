import './App.css';

const DEBUG = false

var DOMAIN_HOST_NAME = window.location.protocol + "//" + window.location.hostname
var APP_CONFIG = {
    DOMAIN_URL: window.location.href + "cloud_nmap_api/",
    RESULT_URL: DOMAIN_HOST_NAME + ":29090/cloud_receive_api/scan_result/",
    LOGON_URL: window.location.href + "user/logon/", 
}

if(DEBUG) {
    DOMAIN_HOST_NAME = "http://192.168.205.180"    // "http://192.168.205.180"
    APP_CONFIG = {
        DOMAIN_URL: DOMAIN_HOST_NAME + ":29080/cloud_nmap_api/",
        RESULT_URL: DOMAIN_HOST_NAME + ":29090/cloud_receive_api/scan_result/",
        LOGON_URL: DOMAIN_HOST_NAME + ":29080/user/logon/", 
    }
}

const RED_STAR = (<span style={{color:"red"}}>*</span>)

function yyq_fetch(url, method, on_ok, on_error, data=null) {
    console.log("yyq_fetch, url is: ", url)
    console.log("yyq_fetch, data type is: ", typeof data, " data = ", data)
    let opt_head = {}
    let mode = 'cors'
    let reg = new RegExp( "://(.*?)/" );
    let url_location = url.match(reg)
    console.log("yyq_fetch, window.location.host = ", window.location.host, ", url location = ", url_location[1])
    if(window.location.host === url_location[1] && method.toLowerCase() === 'get') {
        mode = 'no-cors'
    }

    //if (method.toLowerCase() === 'get') {
    //if ((method.toLowerCase() === 'get' || !data) && !DEBUG) {
    //    mode = 'no-cors'
    //}

    if(data) {
        if(typeof data === "object") {
            if(data instanceof FormData) {
                console.log("yyq_fetch, data is FormData")
                // let content_type = "" // "multipart/form-data; boundary=----WebKitFormBoundaryAnydWsQ1ajKuGoCd" // "application/x-www-form-urlencoded; charset=UTF-8"   // "multipart/form-data"
                opt_head = {}
            }
            else {
                console.log("yyq_fetch, data is object will trans to json string")
                let content_type = (method.toLowerCase() === 'get') ? 'text/plain' : 'application/json';
                opt_head = {'Content-Type': content_type}
                data = JSON.stringify(data)
            }
        } else if(typeof data === "string") {
            opt_head = {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
        }
    }

    console.log("yyq_fetch, befor call fetch, url = ", url, 
        ", mode = ", mode, ", opt_head = ", opt_head)

    fetch(url, {
        method: method,
        headers: opt_head,
        body: data,
        mode: mode,
        redirect: 'follow',
        cache: 'default'
    })
    .then(res => {
        console.log("res = ", res); 
        return res.json()
    })
    .then(res_json => {
        console.log("res_json = ", res_json);
        if(0 !== res_json.err) {
            on_error(res_json.err_msg)
        } else {
            on_ok(res_json)
        }
    })
    .catch(error => {
        console.log("error = ", error);
        on_error(String(error))
    }) 
}

function string_is_empty(str) {
    if(typeof str === "undefined" || str === null || str === "")
        return true;

    if (str.replace(/(^s*)|(s*$)/g, "").length === 0)
        return true;

    return false;
}

function get_local_stroage_value(key_name, default_value = null) {
    if(localStorage.hasOwnProperty(key_name)) {
        let value = localStorage.getItem(key_name);
        console.log("local storage " + key_name + " get value = ", value);
        return JSON.parse(value);
    } else {
        return default_value;
    }
}

function set_local_stroage_value(key_name, value) {
    return localStorage.setItem(key_name, JSON.stringify(value));
}

export { APP_CONFIG, RED_STAR, yyq_fetch, string_is_empty, get_local_stroage_value, set_local_stroage_value };