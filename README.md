## dhcp2 ![dhcp2@1.0.0](https://img.shields.io/npm/v/dhcp2.svg)

> dhcp client and server in nodejs

### Installation

```bash
$ npm i dhcp2
```

### Example

```js
const dhcp = require('dhcp2');

const server = dhcp.createServer(function(request, response){

  console.log(request);

}).listen();

```

### Specification

+ https://tools.ietf.org/html/rfc2131
+ https://tools.ietf.org/html/rfc2132
+ https://tools.ietf.org/html/rfc4039
+ https://tools.ietf.org/html/rfc4702

### Contributing
- Fork this Repo first
- Clone your Repo
- Install dependencies by `$ npm install`
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3

### MIT

---