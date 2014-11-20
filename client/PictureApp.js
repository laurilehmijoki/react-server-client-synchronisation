var React = require('react')
var $ = require('jquery')
var Bacon = require('baconjs')

var searchResults = (function() {
  var searchQueue = new Bacon.Bus()
  var results = searchQueue.flatMapLatest((query) => Bacon.fromPromise($.getJSON('/api/pictures?q=' + query)))
  return function(query) {
    searchQueue.push(query)
    return results
  }
})()

var PictureApp = (initialModel) => React.createFactory(React.createClass({
  getInitialState: function() {
    return {
      pictures: initialModel.pictures,
      query: initialModel.query
    }
  },

  searchForPics: function(event) {
    var query = event.target.value
    this.setState({query: query})
    history.replaceState(query, '', '/?q=' + query)
    searchResults(query).onValue(function(response) {
      this.setState({ pictures: response.responseData.results })
    }.bind(this))
  },

  render: function() {
    return (
      <html>
        <head>
          <title>Search pictures</title>
          <script src="/bundle.js"/>
          <script dangerouslySetInnerHTML={{__html: "window.INITIAL_MODEL = " + JSON.stringify(initialModel)}}/>
          <link href="/style.css" rel="stylesheet"/>
        </head>
        <body>
          <input type="text" onChange={this.searchForPics} placeholder="Search for pictures – try kittens!" value={this.state.query}/>
          {this.state.pictures.map((picture, key) =>
            <div key={key} className="result">
              <img src={picture.tbUrl}/>
              <br/>
              <a href={picture.originalContextUrl}>{picture.titleNoFormatting}</a>
            </div>
          )}
        </body>
      </html>
    )
  }
}))

var inBrowser = typeof window != 'undefined'

if (inBrowser) {
  window.onload = function() {
    React.render(PictureApp(window.INITIAL_MODEL)(), document)
  }
}

module.exports = PictureApp