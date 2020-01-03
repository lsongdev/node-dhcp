const { debuglog } = require('util');
const options = require('./options');
const { mac, str, ipv4 } = require('./util');

const debug = debuglog('dhcp2');

/**
 * [Packet description]
 * https://tools.ietf.org/html/rfc2131
 * https://tools.ietf.org/html/rfc2132
 * https://www.iana.org/assignments/bootp-dhcp-parameters
 */
function Packet() {
  this.op = 0;
  this.htype = 0;
  this.hlen = 0;
  this.hops = 0;
  this.xid = 0;
  this.secs = 0;
  this.flags = 0;
  return this;
}

Packet.prototype.toBuffer = function () {
  const buffer = new Buffer(1);
  buffer.write(this.op);
  return buffer;
};

Packet.OPCODE = {
  BOOTREQUEST: 0x01,
  BOOTREPLY: 0x02
};

Packet.TYPES = {
  // rfc2132
  DHCPDISCOVER: 0x01,
  DHCPOFFER: 0x02,
  DHCPREQUEST: 0x03,
  DHCPDECLINE: 0x04,
  DHCPACK: 0x05,
  DHCPNAK: 0x06,
  DHCPRELEASE: 0x07,
  DHCPINFORM: 0x08,
  // rfc3203
  DHCPFORCERENEW: 0x09,
  // rfc4388
  DHCPLEASEQUERY: 0x10,
  DHCPLEASEUNASSIGNED: 11,
  DHCPLEASEUNKNOWN: 12,
  DHCPLEASEACTIVE: 13,
  // rfc6296
  DHCPBULKLEASEQUERY: 14,
  DHCPLEASEQUERYDONE: 15,
  // rfc7724
  DHCPACTIVELEASEQUERY: 16,
  DHCPLEASEQUERYSTATUS: 17,
  DHCPTLS: 18
};

Packet.OPTION_TYPES = options.TYPES;

const read = (type, data) => {
  switch (type) {
    case 'UInt8':
      return data.readUInt8();
    case 'UInt8s':
      return [].slice.call(data);
    case 'UInt16':
      return data.readUInt16BE();
    case 'Int32':
      return data.readInt32BE();
    case 'UInt32':
      return data.readUInt32BE();
    case 'IP':
      return ipv4(data);
    case 'ASCII':
      return data.toString('ascii');
    default:
      console.log('read unknow type:', type);
  }
  return data;
};

/**
 * [parse description]
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
Packet.parse = function (msg) {
  var packet = new Packet();
  packet.op = msg.readUInt8(0);
  packet.htype = msg.readUInt8(1);
  packet.hlen = msg.readUInt8(2);
  packet.hops = msg.readUInt8(3);
  packet.xid = msg.readUInt32BE(4);
  packet.secs = msg.readUInt16BE(8);
  packet.flags = msg.readUInt16BE(10);
  packet.ciaddr = ipv4(msg.slice(12, 12 + 4));
  packet.yiaddr = ipv4(msg.slice(16, 16 + 4));
  packet.siaddr = ipv4(msg.slice(20, 20 + 4));
  packet.giaddr = ipv4(msg.slice(24, 24 + 4));
  packet.chaddr = mac(msg.slice(28, 28 + 16));
  packet.sname = str(msg.slice(44, 44 + 64));
  packet.file = str(msg.slice(108, 108 + 128));
  // The first four octets of the 'options' field of the DHCP message
  // contain the (decimal) values 99, 130, 83 and 99, respectively (this
  // is the same magic cookie as is defined in RFC 1497 [17]).
  packet.magicCookie = msg.slice(236, 236 + 4);
  packet.options = {};
  var pos = 240, ended, code, len, data;
  while (!ended && pos < msg.length) {
    code = msg[pos++];
    switch (code) {
      // https://tools.ietf.org/html/rfc2132#section-3.1
      case 0x00: pos++; break;
      // https://tools.ietf.org/html/rfc2132#section-3.2
      case 0xff: ended = true; break;
      default: {
        len = msg.readUInt8(pos++);
        data = msg.slice(pos, pos = pos + len);
        const option = options[code];
        if (!option) {
          debug('unknow option:', code, data);
          continue;
        }
        const { type, decode } = option;
        const value = decode ? decode(data) : read(type, data);
        packet.options[code] = value;
      };
    }
  };
  return packet;
};

module.exports = Packet;