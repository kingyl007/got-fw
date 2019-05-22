import { Progress } from 'antd';

export function link(text) {
    return (<span>{text}<span style={{ width: 80 }}><Progress percent={30} size="small" /></span></span>);
}