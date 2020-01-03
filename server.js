const udp = require('dgram');
const Packet = require('./packet');

const SERVER_PORT = 67;
const CLIENT_PORT = 68;

const INADDR_ANY = '0.0.0.0';
const INADDR_BROADCAST = '255.255.255.255';
/**
 * DHCPServer
 * @docs https://tools.ietf.org/html/rfc2131
 */
class DHCPServer extends udp.Socket {
  constructor(options) {
    options = Object.assign({
      type: 'udp4'
    }, options);
    super(options.type);
    this.on('message', this.handleMessage.bind(this));
    this.on(Packet.TYPES.DHCPREQUEST, this.handleRequest.bind(this));
    this.on(Packet.TYPES.DHCPDISCOVER, this.handleDiscover.bind(this));
    return this;
  }
  handleMessage(message) {
    const packet = Packet.parse(message);
    this.emit('data', packet);
    this.emit(packet.options[Packet.OPTION_TYPES.MessageType], packet);
  }
  handleDiscover(request) {
    this.emit('discover', request);
  }
  handleRequest(request) {
    this.emit('request', request);
  }
  createOffer(lease) {
    const packet = new Packet();
    packet.op = Packet.OPCODE.BOOTREPLY;
    packet.xid = request.xid;
    packet.flags = request.flags;
    packet.ciaddr = INADDR_ANY;
    packet.yiaddr = lease.address;
    packet.giaddr = request.giaddr;
    packet.chaddr = request.chaddr;
    packet.options[Packet.OPTION_TYPES.MessageType] = Packet.TYPES.DHCPOFFER;
    return packet;
  }
  listen(port = SERVER_PORT, listener) {
    this.bind(port, INADDR_ANY, err => {
      this.setBroadcast(true);
      listener && listener(err);
    });
  }
}

module.exports = DHCPServer;