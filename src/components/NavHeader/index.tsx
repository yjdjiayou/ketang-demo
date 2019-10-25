import React from 'react';
import './index.less';
import { Icon } from 'antd';
interface Props {
    history: any;
    children: any
}
export default function NavHeader(props: Props) {
    return (
        <div className="nav-header">
            <Icon type="left" onClick={() => props.history.goBack()} />
            {props.children}
        </div>
    )
}
