const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

dns.resolveSrv('_mongodb._tcp.cluster0.ul56sg3.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('SRV Record lookup failed:', err.message);
  } else {
    console.log('SRV Records:', addresses);
  }
});
