const { mac } = require('./util');

const TYPES = {
  // https://tools.ietf.org/html/rfc2132#section-3.3
  SubnetMask: 1,
  // https://tools.ietf.org/html/rfc2132#section-3.4
  TimeOffset: 2,
  // https://tools.ietf.org/html/rfc2132#section-3.5
  Router: 3,
  // https://tools.ietf.org/html/rfc2132#section-3.6  
  TimeServer: 4,
  // https://tools.ietf.org/html/rfc2132#section-3.7
  NameServer: 5,
  // https://tools.ietf.org/html/rfc2132#section-3.8
  DomainNameServer: 6,
  // https://tools.ietf.org/html/rfc2132#section-3.9
  LogServer: 7,
  // https://tools.ietf.org/html/rfc2132#section-3.10
  CookieServer: 8,
  // https://tools.ietf.org/html/rfc2132#section-3.11
  LPRServer: 9,
  // https://tools.ietf.org/html/rfc2132#section-3.12
  ImpressServer: 10,
  // https://tools.ietf.org/html/rfc2132#section-3.13
  ResourceLocationServer: 11,
  // https://tools.ietf.org/html/rfc2132#section-3.14
  HostName: 12,
  // https://tools.ietf.org/html/rfc2132#section-3.15
  BootFileSize: 13,
  // https://tools.ietf.org/html/rfc2132#section-3.16
  MeritDumpFile: 14,
  // https://tools.ietf.org/html/rfc2132#section-3.17
  DomainName: 15,
  // https://tools.ietf.org/html/rfc2132#section-3.18
  SwapServer: 16,
  /**
   * This option is used in a client request (DHCPDISCOVER) to allow the
   * client to request that a particular IP address be assigned.
   * @docs https://tools.ietf.org/html/rfc2132#section-9.1
   */
  RequestedIPAddress: 50,
  /**
   * This option is used to convey the type of the DHCP message.
   * @docs https://tools.ietf.org/html/rfc2132#section-9.6
   */
  MessageType: 53,
  /**
   * @docs https://tools.ietf.org/html/rfc2132#section-9.14
   */
  ClientIdentifier: 61,
};

const options = {
  [TYPES.SubnetMask]: { // RFC 2132
    name: 'Subnet Mask',
    type: 'IP',
    config: 'netmask',
  },
  [TYPES.TimeOffset]: { // RFC 2132
    name: 'Time Offset',
    type: 'Int32',
    config: 'timeOffset'
  },
  [TYPES.Router]: { // RFC 2132
    name: 'Router',
    type: 'IPs',
    config: 'router',
  },
  [TYPES.TimeServer]: { // RFC 2132
    name: 'Time Server',
    type: 'IPs',
    config: 'timeServer'
  },
  [TYPES.NameServer]: {
    name: 'Name Server',
    type: 'IPs',
    config: 'nameServer'
  },
  [TYPES.DomainNameServer]: { // RFC 2132
    name: 'Domain Name Server',
    type: 'IPs',
    config: 'dns',
  },
  [TYPES.LogServer]: { // RFC 2132
    name: 'Log Server',
    type: 'IPs',
    config: 'logServer'
  },
  [TYPES.CookieServer]: {
    name: 'Cookie Server',
    type: 'IPs',
    config: 'cookieServer'
  },
  [TYPES.LPRServer]: {
    name: 'LPR Server',
    type: 'IPs',
    config: 'lprServer'
  },
  [TYPES.ImpressServer]: {
    name: 'Impress Server',
    type: 'IPs',
    config: 'impressServer'
  },
  [TYPES.ResourceLocationServer]: {
    name: 'Resource Location Server',
    type: 'IPs',
    config: 'rscServer'
  },
  [TYPES.HostName]: { // RFC 2132
    name: 'Host Name',
    type: 'ASCII',
    config: 'hostname'
  },
  [TYPES.BootFileSize]: {
    name: 'Boot File Size',
    type: 'UInt16',
    config: 'bootFileSize'
  },
  [TYPES.MeritDumpFile]: {
    name: 'Merit Dump File',
    type: 'ASCII',
    config: 'dumpFile'
  },
  [TYPES.DomainName]: { // RFC 2132
    name: 'Domain Name',
    type: 'ASCII',
    config: 'domainName'
  },
  16: {
    name: 'Swap Server',
    type: 'IP',
    config: 'swapServer'
  },
  17: {
    name: 'Root Path',
    type: 'ASCII',
    config: 'rootPath'
  },
  18: {
    name: 'Extension Path',
    type: 'ASCII',
    config: 'extensionPath'
  },
  19: {
    name: 'IP Forwarding',
    type: 'UInt8',
    config: 'ipForwarding',
    enum: {
      0: 'Disabled',
      1: 'Enabled'
    }
  },
  20: {
    name: 'Non-Local Source Routing',
    type: 'Bool',
    config: 'nonLocalSourceRouting'
  },
  21: {
    name: 'Policy Filter',
    type: 'IPs',
    config: 'policyFilter'
  },
  22: {
    name: 'Maximum Datagram Reassembly Size',
    type: 'UInt16',
    config: 'maxDatagramSize'
  },
  23: {
    type: 'UInt8',
    config: 'datagramTTL'
  },
  24: {
    name: 'Path MTU Aging Timeout',
    type: 'UInt32',
    config: 'mtuTimeout'
  },
  25: {
    name: 'Path MTU Plateau Table',
    type: 'UInt16s',
    config: 'mtuSizes'
  },
  26: {
    name: 'Interface MTU',
    type: 'UInt16',
    config: 'mtuInterface'
  },
  27: {
    name: 'All Subnets are Local',
    type: 'UInt8',
    config: 'subnetsAreLocal',
    enum: {
      0: 'Disabled',
      1: 'Enabled'
    }
  },
  28: {
    name: 'Broadcast Address',
    type: 'IP',
    config: 'broadcast',
  },
  29: {
    name: 'Perform Mask Discovery',
    type: 'UInt8',
    config: 'maskDiscovery',
    enum: {
      0: 'Disabled',
      1: 'Enabled'
    }
  },
  30: {
    name: 'Mask Supplier',
    type: 'UInt8',
    config: 'maskSupplier',
    enum: {
      0: 'Disabled',
      1: 'Enabled'
    }
  },
  31: {
    name: 'Perform Router Discovery',
    type: 'UInt8',
    config: 'routerDiscovery',
  },
  32: {
    name: 'Router Solicitation Address',
    type: 'IP',
    config: 'routerSolicitation'
  },
  33: {
    name: 'Static Route',
    type: 'IPs',
    config: 'staticRoutes'
  },
  34: {
    name: 'Trailer Encapsulation',
    type: 'Bool',
    config: 'trailerEncapsulation'
  },
  35: {
    name: 'ARP Cache Timeout',
    type: 'UInt32',
    config: 'arpCacheTimeout'
  },
  36: {
    name: 'Ethernet Encapsulation',
    type: 'Bool',
    config: 'ethernetEncapsulation'
  },
  37: {
    type: 'UInt8',
    config: 'tcpTTL'
  },
  38: {
    name: 'TCP Keepalive Interval',
    type: 'UInt32',
    config: 'tcpKeepalive'
  },
  39: {
    name: 'TCP Keepalive Garbage',
    type: 'Bool',
    config: 'tcpKeepaliveGarbage'
  },
  40: {
    name: 'Network Information Service Domain',
    type: 'ASCII',
    config: 'nisDomain'
  },
  41: {
    name: 'Network Information Servers',
    type: 'IPs',
    config: 'nisServer'
  },
  42: {
    name: 'Network Time Protocol Servers',
    type: 'IPs',
    config: 'ntpServer'
  },
  43: { // RFC 2132
    name: 'Vendor Specific Information',
    type: 'UInt8s',
    config: 'vendor'
  },
  44: {
    name: 'NetBIOS over TCP/IP Name Server',
    type: 'IPs',
    config: 'nbnsServer'
  },
  45: {
    name: 'NetBIOS over TCP/IP Datagram Distribution Server',
    type: 'IP',
    config: 'nbddServer'
  },
  46: {
    name: 'NetBIOS over TCP/IP Node Type',
    type: 'UInt8',
    enum: {
      0x1: 'B-node',
      0x2: 'P-node',
      0x4: 'M-node',
      0x8: 'H-node'
    },
    config: 'nbNodeType'
  },
  47: {
    name: 'NetBIOS over TCP/IP Scope',
    type: 'ASCII',
    config: 'nbScope'
  },
  48: {
    name: 'X Window System Font Server',
    type: 'IPs',
    config: 'xFontServer'
  },
  49: {
    name: 'X Window System Display Manager',
    type: 'IPs',
    config: 'xDisplayManager'
  },
  50: { // IP wish of client in DHCPDISCOVER
    name: 'Requested IP Address',
    type: 'IP',
    attr: 'requestedIpAddress'
  },
  51: { // RFC 2132
    name: 'IP Address Lease Time',
    type: 'UInt32',
    config: 'leaseTime',
  },
  52: {
    name: 'Option Overload',
    type: 'UInt8',
    enum: {
      1: 'file',
      2: 'sname',
      3: 'both'
    }
  },
  53: {
    name: 'DHCP Message Type',
    type: 'UInt8',
    config: 'type',
    enum: {
      1: 'DHCPDISCOVER',
      2: 'DHCPOFFER',
      3: 'DHCPREQUEST',
      4: 'DHCPDECLINE',
      5: 'DHCPACK',
      6: 'DHCPNAK',
      7: 'DHCPRELEASE',
      8: 'DHCPINFORM'
    },
  },
  54: {
    name: 'Server Identifier',
    type: 'IP',
    config: 'server'
  },
  55: { // Sent by client to show all things the client wants
    name: 'Parameter Request List',
    type: 'UInt8s',
    attr: 'requestParameter',
  },
  56: { // Error message sent in DHCPNAK on failure
    name: 'Message',
    type: 'ASCII'
  },
  57: {
    name: 'Maximum DHCP Message Size',
    type: 'UInt16',
    config: 'maxMessageSize',
  },
  58: {
    name: 'Renewal (T1) Time Value',
    type: 'UInt32',
    config: 'renewalTime',
  },
  59: {
    name: 'Rebinding (T2) Time Value',
    type: 'UInt32',
    config: 'rebindingTime',
  },
  60: { // RFC 2132: Sent by client to identify type of a client
    name: 'Vendor Class-Identifier',
    type: 'ASCII',
    attr: 'vendorClassId'
  },
  61: {
    // Sent by client to specify their unique identifier, to be used to disambiguate the lease on the server
    // https://tools.ietf.org/html/rfc2132#section-9.14
    name: 'Client-Identifier',
    attr: 'clientId',
    decode(data) {
      const [ type ] = data;
      return mac(data.slice(1))
    }
  },
  64: {
    name: 'Network Information Service+ Domain',
    type: 'ASCII',
    config: 'nisPlusDomain'
  },
  65: {
    name: 'Network Information Service+ Servers',
    type: 'IPs',
    config: 'nisPlusServer'
  },
  66: { // RFC 2132: PXE option
    name: 'TFTP server name',
    type: 'ASCII',
    config: 'tftpServer' // e.g. '192.168.0.1'
  },
  67: { // RFC 2132: PXE option
    name: 'Bootfile name',
    type: 'ASCII',
    config: 'bootFile' // e.g. 'pxelinux.0'
  },
  68: {
    name: 'Mobile IP Home Agent',
    type: 'ASCII',
    config: 'homeAgentAddresses'
  },
  69: {
    name: 'Simple Mail Transport Protocol (SMTP) Server',
    type: 'IPs',
    config: 'smtpServer'
  },
  70: {
    name: 'Post Office Protocol (POP3) Server',
    type: 'IPs',
    config: 'pop3Server'
  },
  71: {
    name: 'Network News Transport Protocol (NNTP) Server',
    type: 'IPs',
    config: 'nntpServer'
  },
  72: {
    type: 'IPs',
    config: 'wwwServer'
  },
  73: {
    type: 'IPs',
    config: 'fingerServer'
  },
  74: {
    type: 'IPs',
    config: 'ircServer'
  },
  75: {
    name: 'StreetTalk Server',
    type: 'IPs',
    config: 'streetTalkServer'
  },
  76: {
    name: 'StreetTalk Directory Assistance (STDA) Server',
    type: 'IPs',
    config: 'streetTalkDAServer'
  },
  80: { // RFC 4039: https://tools.ietf.org/html/rfc4039
    name: 'Rapid Commit',
    type: 'Bool',
    attr: 'rapidCommit'
  },
  // https://tools.ietf.org/html/rfc4702#section-2
  81: {
    name: 'FQDN',
  },
  95: {
    name: 'LDAP Servers',
    type: 'IPs',
    config: 'ldapServer'
  },
  // RFC 2563: https://tools.ietf.org/html/rfc2563
  116: {
    name: 'Auto-Configure',
    type: 'UInt8',
    enum: {
      0: 'DoNotAutoConfigure',
      1: 'AutoConfigure'
    },
    attr: 'autoConfigure'
  },
  118: { // RFC 301
    name: 'Subnet Selection',
    type: 'IP',
    config: 'subnetSelection'
  },
  119: { // dns search list
    name: 'Domain Search List',
    type: 'ASCII',
    config: 'domainSearchList'
  },
  121: { // rfc 3442
    name: 'Classless Route Option Format',
    type: 'IPs',
    config: 'classlessRoute'
  },
  145: { // RFC 6704: https://tools.ietf.org/html/rfc6704
    name: 'Forcerenew Nonce',
    type: 'UInt8s',
    attr: 'renewNonce'
  },
  208: { // https://tools.ietf.org/html/rfc5071
    name: 'PXE Magic Option',
    type: 'UInt32',
    config: 'pxeMagicOption',
  },
  209: { // https://tools.ietf.org/html/rfc5071
    name: 'PXE Config File',
    type: 'ASCII',
    config: 'pxeConfigFile'
  },
  210: { // https://tools.ietf.org/html/rfc5071
    name: 'PXE Path Prefix',
    type: 'ASCII',
    config: 'pxePathPrefix'
  },
  211: { // https://tools.ietf.org/html/rfc5071
    name: 'PXE Reboot Time',
    type: 'UInt32',
    config: 'pxeRebootTime'
  },
  252: { // https://en.wikipedia.org/wiki/Web_Proxy_Auto-Discovery_Protocol
    name: 'Web Proxy Auto-Discovery',
    type: 'ASCII',
    config: 'wpad'
  },
  1001: { // TODO: Fix my number!
    name: 'Static',
    config: 'static'
  },
  1002: { // TODO: Fix my number!
    name: 'Random IP',
    type: 'Bool',
    config: 'randomIP',
  }
};

options.TYPES = TYPES;
module.exports = options;