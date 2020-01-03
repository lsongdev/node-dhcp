
function ipv4(data) {
  return [
    data[0],
    data[1],
    data[2],
    data[3]
  ].join('.');
}

function mac(data) {
  return [].slice.call(data).filter(function (c) {
    return !!c;
  }).map(function (c) {
    return c.toString(16);
  }).join(':');
}

function str(data) {
  return data.toString('ascii').replace(/\u0000/g, '');
}

module.exports = {
  mac,
  str,
  ipv4,
};