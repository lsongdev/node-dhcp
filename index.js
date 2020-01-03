const udp = require('dgram');
const EventEmitter = require('events');
const Packet = require('./packet');

const SERVER_PORT = 67;
const CLIENT_PORT = 68;

const INADDR_ANY = '0.0.0.0';
const INADDR_BROADCAST = '255.255.255.255';

/**
 * DHCP Client
 * @rfc: https://tools.ietf.org/html/rfc2132
 */
class DHCP extends udp.Socket {
  constructor(options) {
    options = Object.assign({
      type: 'udp4'
    }, options);
    super(options.type);
    this.on('message', message => {
      const packet = Packet.parse(message);
      this.emit(packet.options[Packet.OPTION_TYPES.MessageType], packet);
    });
    this.on(Packet.TYPES.DHCPACK, this.handleAck.bind(this));
    this.on(Packet.TYPES.DHCPOFFER, this.handleOffer.bind(this));
    return this;
  }
  handleOffer(offer) {
    this.emit('offer', offer);
  }
  handleAck(message) {
    this.emit('ack', message);
  }
  listen(port = CLIENT_PORT, address) {
    this.socket.bind(port, address);
    return this;
  }
  discover(mac) {
    const packet = new Packet();
    packet.op = Packet.OPCODE.BOOTREQUEST;
    packet.hlen = 6;
    packet.chaddr = mac;
    return this.send(packet);
  }
  request(lease) {
    const packet = new Packet();
    packet.op = BOOTREQUEST;
    packet.chaddr = this.mac;
    packet.ciaddr = INADDR_ANY;
    packet.yiaddr = INADDR_ANY;
    packet.giaddr = INADDR_ANY;
    packet.options[Packet.OPTION_TYPES.MessageType] = Packet.TYPES.DHCPREQUEST;
    packet.options[Packet.OPTION_TYPES.ClientIdentifier] = this.mac;
    packet.options[Packet.OPTION_TYPES.RequestedIPAddress] = lease.address;
    this.send(packet.toBuffer());
  }
  send(data) {
    if (data instanceof Packet)
      data = data.toBuffer();
    super.send(data, CLIENT_PORT, INADDR_BROADCAST, (err) => {
      console.log('send -> ', err);
    });
    return this;
  }
}

DHCP.Packet = Packet;
DHCP.Server = require('./server');
DHCP.createServer = function (options) {
  return new DHCP.Server(options);
};

module.exports = DHCP;