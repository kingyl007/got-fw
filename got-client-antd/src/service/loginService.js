import fwRequest from './fwService';

export function login(args) {
    return fwRequest(`/fw/login`, {
        method: 'POST',
        body: args,
    });
}
