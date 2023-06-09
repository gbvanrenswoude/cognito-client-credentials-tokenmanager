import TokenManager from '../src/index';

const argv = require('yargs/yargs')(process.argv.slice(2))
    .options({
        'clientId': { type: 'string', demandOption: true, alias: 'c' },
        'clientSecret': { type: 'string', demandOption: true, alias: 's' },
        'tokenEndpoint': { type: 'string', demandOption: true, alias: 'u' },
        'scope': { type: 'string', demandOption: true, alias: 'p' },
    })
    .help()
    .alias('help', 'h')
    .argv;

const main = async () => {
    try {
        const tokenManager = new TokenManager(argv.clientId, argv.clientSecret, argv.tokenEndpoint, argv.scope);
        const jwtToken = await tokenManager.getToken();
        console.log("JWT Token: ", jwtToken);
    } catch (error) {
        console.error('Failed to get token', error);
    }
}

main();
