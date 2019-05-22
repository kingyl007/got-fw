import fwRequest from './fwService';

export function getTreeData(args) {
    return fwRequest(`/fw/getTreeData`, {
        method: 'POST',
        body: args,
    });
}

export function queryTreeData(args) {
    return fwRequest(`/fw/queryTreeData`, {
        method: 'POST',
        body: args,
    });
}