import React from 'react';
import { Popover } from 'antd';

function DataDetail(title, record) {
    console.log("record = ", record)

    const SHOW_CONTENT = (
        <table border="1"><thead><tr><td> 字段 </td><td> 值 </td></tr></thead><tbody>
        {
            Object.keys(record).map(key => (
                <tr><td> {key} </td><td> {record[key]} </td></tr>
            ))
        }
        </tbody></table>
    )

    return (
        <Popover content={SHOW_CONTENT} title={title}>
            <a>{title}</a>
        </Popover>
    );
}

export default DataDetail;