const DHCP = require('..');

const client = new DHCP();

client.on('offer', lease => {
  client.request(lease);
});

client.discover();