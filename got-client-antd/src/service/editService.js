import fwRequest from './fwService';

export function getEditData(args) {
    return fwRequest(`/fw/getEditData`, {
        method: 'POST',
        body: args,
    });
}

export function saveEditData(args) {
    return fwRequest(`/fw/saveEditData`, {
        method: 'POST',
        body: args,
    });
}

export function getRefData(args) {
    return fwRequest(`/fw/getRefData`, {
        method: 'POST',
        body: args,
    });
}
