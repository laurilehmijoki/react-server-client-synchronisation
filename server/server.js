require('node-jsx').install({harmony: true})
var express = require('express')
var React = require('react')
var request = require('request')
var app = express()

app.get('/', function(req, res, next) {
  res.send('Ok')
})

function picturesUrl(query) {
  return  "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + query
}

app.get('/api/pictures', function(req, res, next) {
  request(picturesUrl(req.query.q)).pipe(res)
})

app.use(express.static(__dirname + '/../assets'))

app.listen(3000, function() {
  console.log("Go to http://localhost:3000")
})
