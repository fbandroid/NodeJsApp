var io = require('socket.io')() // yes, no server arg here; it's not required
// attach stuff to io


io.on('connection', function (socket) {
    //socket.emit('news', { hello: 'world' });
    socket.on('hello', function (data) {
      console.log(data);
    });
  });


module.exports = io