const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const {} = require('socket.io')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
//Routes File
const errorHandler = require('./middleware/error');
const events = require('./routes/events');
const auth = require('./routes/auth');
const admin = require('./routes/admin');
const images = require('./routes/images');
const stakes = require('./routes/stakes');
const ccavenue = require('./routes/ccavenue');
const cashfreepayment = require('./routes/cashfreepayment');

const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

//Body Parser
app.use(express.json());

//url-encoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//Cookie Parser
// app.use(cookieParser);

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Sanitize data
app.use(mongoSanitize());

//Set Security headers
app.use(helmet());

//Prevent XSS Attacks
app.use(xss());

//Rate Limit
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 600,
});

app.use(limiter);

//Prevent HTPP Params Pollution
app.use(hpp());

//CORS
app.use(cors());

//Mount routers
app.use('/api/v1/events', events);
app.use('/api/v1/auth', auth);
app.use('/api/v1/admin', admin);
app.use('/api/v1/profileimg', images);
app.use('/api/v1/stakes', stakes);
app.use('/api/v1/payment', ccavenue);
app.use('/api/v1/cashpayment', cashfreepayment);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// const io = require('socket.io')(server);
// io.on('connection', (socket) => {
//   console.log('Client Connected');
// });

//Handle unhadled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error : ${err.message}`.red);
  //Close server and exist
  server.close(() => process.exit(1));
});
