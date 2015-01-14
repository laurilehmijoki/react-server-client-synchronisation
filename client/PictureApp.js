var React = require('react')
var $ = require('jquery')
var Bacon = require('baconjs')

var searchResults = (function() {
  var searchQueue = new Bacon.Bus()
  var results = searchQueue.flatMapLatest(
    (query) => Bacon.fromPromise($.getJSON('/api/pictures?q=' + query))
  ).log()
  return function(query) {
    searchQueue.push(query)
    return results
  }
})()

var PictureApp = React.createClass({
  getInitialState: function() {
    return {
      pictures: [],
      query: undefined
    }
  },

  componentDidMount: function() {
    var initialSearchQuery = (document.location.search.match(/\?q=(.*)/) || [])[1]
    if (initialSearchQuery) {
      this.searchForPics(initialSearchQuery)
    }
  },

  searchForPics: function(query) {
    this.setState({query: query})
    history.replaceState(query, '', '/?q=' + query)
    searchResults(query).onValue(function(response) {
      this.setState({ pictures: response.responseData.results })
    }.bind(this))
  },

  render: function() {
    return (
      <div>
        <input
          type="text"
          onChange={(event) => this.searchForPics(event.target.value)}
          placeholder="Search for pictures – try kittens!"
          value={this.state.query}/>
          {this.state.pictures.map((picture, key) =>
            <div key={key} className="result">
              <img src={picture.tbUrl}/>
              <br/>
              <a href={picture.originalContextUrl}>{picture.titleNoFormatting}</a>
            </div>
          )}
      </div>
    )
  }
})

var inBrowser = typeof window != 'undefined'

if (inBrowser) {
  window.onload = function() {
    React.render(<PictureApp/>, document.getElementById('app'))
  }
}

module.exports = PictureApp
