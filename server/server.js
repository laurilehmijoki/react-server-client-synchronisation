require('node-jsx').install({harmony: true})
var express = require('express')
var React = require('react')
var request = require('request')
var app = express()

var PictureApp = React.createFactory(require('../client/PictureApp.js'))

app.get('/', function(req, res, next) {
  var query = req.query.q
  function render(pictures) {
    var initialModel = {
      query: query,
      pictures: pictures
    }
    res.send(React.renderToString(PictureApp({initialModel: initialModel})))
  }
  if (query) {
    request(picturesUrl(req.query.q), function(err, res, body) {
      render(JSON.parse(body).responseData.results)
    })
  } else {
    render([])
  }
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
