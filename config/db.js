const mangoose = require('mongoose');

const connectDB = async () => {
  const conn = await mangoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`.blue.underline);
};

module.exports = connectDB;
