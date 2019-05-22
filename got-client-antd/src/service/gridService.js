import fwRequest from './fwService';

export function getGridData(args) {
    return fwRequest(`/fw/getGridData`, {
        method: 'POST',
        body: args,
    });
}

export function validDeleteData(args) {
    return fwRequest(`/fw/validDeleteData`, {
        method: 'POST',
        body: args,
    });
}

export function deleteData(args) {
    return fwRequest(`/fw/deleteData`, {
        method: 'POST',
        body: args,
    });
}

export function getSelectData(args) {
    return fwRequest(`/fw/getSelectData`, {
        method: 'POST',
        body: args,
    });
}

export function saveSelectData(args) {
    return fwRequest(`/fw/saveSelectData`, {
        method: 'POST',
        body: args,
    });
}