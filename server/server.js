const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const romanNumerals = require('roman-numerals-a');

let PORT = process.env.PORT || 3000;

let VERIFY_TOKEN = process.env.SLACK_VERIFY_TOKEN || 'vg8GXKUlos4Z3C7RXo7HndyA';

if (!VERIFY_TOKEN) {
  console.error('SLACK_VERIFY_TOKEN is required');
  process.exit(1);
}
if (!PORT) {
  console.error('PORT is required');
  process.exit(1);
}

let app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

app
  .route('/')
  .get(function (req, res) {
    res.json({
      name: 'roman-numerals-slack',
      version: '1.0.0',
    });
  })

  .post(function (req, res) {
    console.log(req.body);
    const option = req.body.command;
    const text = req.body.text;
    let result;
    switch (option) {
      case 'parse':
      case '/parse':
        result = romanNumerals.parse(text);
        break;
      case 'stringify':
      case '/stringify':
        result = romanNumerals.stringify(parseInt(text));
        break;
      default:
        result = 'comando incorrecto (debe ser "parse" o "stringify")';
    }
    res.json({
      response_type: 'in_channel',
      text: result.toString(),
    });
  });

app.listen(PORT || 3000, function (err) {
  if (err) {
    return console.error('Error starting server: ', err);
  }

  console.log('Server successfully started on port %s', PORT);
});
