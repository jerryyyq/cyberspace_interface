const APP_CONFIG = {
    DOMAIN_URL: "http://127.0.0.1:29080/cloud_nmap_api/",
}


function yyq_fetch(url, method, on_ok, on_error) {
    fetch(url, {
        method: method,
        headers:{
            //'Content-Type':'application/json;charset=UTF-8'
            'Content-Type':'text/plain'
        },
        mode:'cors',
        cache:'default'
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

export { APP_CONFIG, yyq_fetch, string_is_empty };