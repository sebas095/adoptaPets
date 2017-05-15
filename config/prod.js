module.exports = {
  db: {
    url: 'mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_PORT_27017_TCP_PORT + '/adopta-pets',
  },
  secret: 'ce1d9858-8a8c-4720-8c44-b2de67595166',
  url: 'http://localhost:3000',
  host: '/adopta-pets',
};
