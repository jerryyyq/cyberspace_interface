import React from 'react';
import { Popover } from 'antd';

function DataDetail(title, record) {
    let content = (
        <table border="0">
        {Object.keys(record).forEach(function(key) {
            <tr><td> {key} </td><td> {record[key]} </td></tr>
        })}
        </table>
    );

    console.log("content = ", content)

    return (
        <Popover content={content} title={title}>
            <a>{title}</a>
        </Popover>
    );
}

export default DataDetail;