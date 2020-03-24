const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');

// create the Express app
const app = express();
const { sequelize } = require('./db/models');

//Initially Create Tables: Not needed after Table creation?
// sequelize.sync({force: true})

app.use(express.json());
app.use(cors());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

//Testing dependencies
const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }))

const blogs = require('./routes/blogs');
const users = require('./routes/users');

//Routes

app.use('/api', users);
app.use('/api', blogs);

app.get('/', (req, res) => {
  res.json({
    message: 'Hey You',
  });
});


// Send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }
  //Set status for Global if not already set
  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// Set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

// Test database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database has successfully connected');
  } catch(error) {
      console.log('Not able to connect to the database:', error);
  }
})();