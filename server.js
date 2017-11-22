// server.js
// where your node app starts

// init project
const express = require('express'),
      app = express(),
      two_emoji = require('./app/two_emoji'),
      fb = require('./app/facebook'),
      sassMiddleware = require("node-sass-middleware");

const PASSPHRASE = process.env.TWO_EMOJI_PASSPHRASE ? process.env.TWO_EMOJI_PASSPHRASE : false;
if ( ! PASSPHRASE ) {
  console.log('Warning! No passphrase set will not be able to post to Facebook')
}

app.set('view engine', 'ejs');
app.use(sassMiddleware({
  src: __dirname + '/public',
  dest: '/tmp'
}));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(express.static('/tmp'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/",  (request, response) => {
  response.render('index', { 
    two_emoji: `${two_emoji.randomChar()} ${two_emoji.randomChar()}` 
  });
});

app.post("/statement", (request, response) => {
  // fire to this http request via curl in a cron tab to make the statements to facebook
  // protect via the passphrase option 
  // /usr/bin/curl -sS -X POST https://two-emoji.glitch.me/statement?passphrase=<passphrase_here> >> ~/two-emoji.log
  if( PASSPHRASE && request.query.passphrase == PASSPHRASE ) {
    let statement = two_emoji.getStatement();
    fb.postToFacebook(statement, (r) => {
      r.statement = statement;
      response.send(r); 
    });
  } else {
    response.redirect( `/` ); 
  }

});

/*
app.get('/test-fb', (request, response) => {
  fb.testFacebook( (r) => {
    response.send(r);
  })
})
*/

const listener = app.listen(process.env.PORT,  () => {
  console.log( 'Everyday is a winding road ' + listener.address().port,
              `${two_emoji.randomChar()} ${two_emoji.randomChar()}`);
});