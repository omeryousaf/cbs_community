exports.App = {
    CouchServerIp: 'http://127.0.0.1:5984',
    server: {
        ip: 'http://127.0.0.1',
        port: '8001',
        env: 'dev'
    },

    mailGunApiKey: 'mailGunKeyHere',
    mailGunDomain : 'mailGunDomainHere',
    secretKey : 'secretKeyHere',
    httpStatuses: {
    	OK: 200,
    	SESSION_EXPIRED: 419,
        LOGOUT: 420
    }
};