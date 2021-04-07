import './App.css';

const APP_CONFIG = {
    DOMAIN_URL: "http://localhost:29080/cloud_nmap_api/",
}

const RED_STAR = (<span style={{color:"red"}}>*</span>)

function yyq_fetch(url, method, on_ok, on_error, data=null) {
    console.log("data type is: ", typeof data)
    let opt_head = {}

    if(typeof data === "object") {
        console.log("yyq_fetch, data is FormData")
        let content_type = "" // "multipart/form-data; boundary=----WebKitFormBoundaryAnydWsQ1ajKuGoCd" // "application/x-www-form-urlencoded; charset=UTF-8"   // "multipart/form-data"
        opt_head = {}
    } else {
        let content_type = (method.toLowerCase() === 'get') ? 'text/plain' : 'application/json';
        opt_head = {'Content-Type':content_type}
    }

    fetch(url, {
        method: method,
        headers: opt_head,
        body: data,
        mode: 'cors',
        redirect: 'follow',
        cache: 'default'
    })
    .then(res => {
        console.log("res = ", res); 
        return res.json()
    })
    .then(data => {
        console.log("data = ", data);
        if(0 !== data.err) {
            on_error(data.err_msg)
        } else {
            on_ok(data)
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


export { APP_CONFIG, RED_STAR, yyq_fetch, string_is_empty };