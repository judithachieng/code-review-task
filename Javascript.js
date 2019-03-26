import express from 'express';
import session from 'session';
import cors from 'cors';
import errorhandler from 'errorhandler';
import mongoose from 'mongoose';
import morgan from 'morgan';
import methodOverride from 'method-override';
import path from 'path';

import './models/User';
import './models/Article';
import './models/Comment';
import './config/passport';


const isProduction = process.env.NODE_ENV === 'production';

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(morgan('dev'));

app.use(methodOverride());

// Use path.join to join segments
const directory = path.join(__dirname, '/public');
app.use(express.static(directory));

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

if (!isProduction) {
  app.use(errorhandler());
}

if(isProduction){
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect('mongodb://localhost/conduit');
  mongoose.set('debug', true);
}



/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});

// finally, let's start our server...
const server = app.listen( process.env.PORT || 3000, function(){
  console.log('Listening on port ' + server.address().port);
});
