const dhcp = require('..');

const server = dhcp.createServer();

server.on('discover', request => {
  console.log('dhcp discover:', request);
});

server.on('request', request => {
  console.log('dhcp request:', request);
});

server.listen();