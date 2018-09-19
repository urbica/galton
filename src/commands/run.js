const fs = require('fs');
const ora = require('ora');
const http = require('http');
const galton = require('../index');

const run = (config = {}) => {
  const spinner = ora('Running server').start();
  const app = galton(config);
  const handler = config.socket || config.port;

  const server = http.createServer(app);
  server.listen(handler, () => {
    let address;
    if (config.socket) {
      fs.chmodSync(config.socket, '1766');
      address = config.socket;
    } else {
      address = server.address();
      address = `${address.address}:${address.port}`;
    }
    spinner.succeed();
    spinner.info(`🚀 ON AIR @ ${address}`);
  });
};

module.exports = run;
