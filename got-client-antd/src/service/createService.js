import fwRequest from './fwService';

export function getCreateData(args) {
    return fwRequest(`/fw/getCreateData`, {
        method: 'POST',
        body: args,
    });
}

export function saveCreateData(args) {
    return fwRequest(`/fw/saveCreateData`, {
        method: 'POST',
        body: args,
    });
}
