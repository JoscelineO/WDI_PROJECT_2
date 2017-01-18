module.exports = {
  port: process.env.PORT || 3000,
  db: process.env.MONGODB_URI || 'mongodb://localhost/my-city-guides',
  secret: process.env.SECRET || 'my heart is in Berlin'
};
