import React from 'react';
import { Popover } from 'antd';
import ReactJson from 'react-json-view'

function JsonDetail(title, data) {
    console.log("data = ", data)

    const SHOW_CONTENT = (
        <ReactJson src={data} displayObjectSize={false} displayDataTypes={false} />
    )

    return (
        <Popover content={SHOW_CONTENT} title={title}>
            <a>{title}</a>
        </Popover>
    );
}

export default JsonDetail;