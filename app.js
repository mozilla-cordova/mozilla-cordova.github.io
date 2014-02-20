
var dom = React.DOM;

var App = React.createClass({
  getInitialState: function() {
    return { issues: [],
             onlyPRs: false,
             filter: '' };
  },

  componentDidMount: function() {
    if(window.CORDOVA_ISSUES) {
      var issues = window.CORDOVA_ISSUES.map(function(issue) {
        issue.created_at = new Date(issue.created_at);
        issue.updated_at = new Date(issue.updated_at);
        return issue;
      });

      this.setState({ issues: issues });
    }
  },

  togglePRs: function() {
    this.setState({ onlyPRs: !this.state.onlyPRs });
  },

  applyFilter: function(value) {
    this.setState({ filter: value });
  },
  
  render: function() {
    var s = this.state;
    var issues = Array.prototype.slice.call(this.state.issues);
    issues.sort(function(a, b) {
      return a.updated_at < b.updated_at ? 1 : -1;
    });

    return dom.div(
      null,
      Toolbar({ togglePRs: this.togglePRs,
                onlyPRs: s.onlyPRs,
                onFilter: this.applyFilter,
                filter: this.state.fitler }),
      dom.ul(
        { className: 'issues' },
        issues.map(function(issue) {
          if(s.onlyPRs && !issue.pull_request.html_url) {
            return null;
          }

          if(s.filter && 
             issue.title.indexOf(s.filter) === -1 &&
             issue.repo.indexOf(s.filter) === -1) {
            return null;
          }

          return dom.li(
            { className: 'issue' }, 
            dom.a(
              { href: issue.html_url },
              issue.title + ' (' + moment(issue.updated_at).format('MM-DD-YYYY') + ')'
            ),
            ' ',
            dom.span({ className: "label label-default" }, issue.repo),
            ' ',
            issue.pull_request.html_url ? 
              dom.span({ className: "label label-danger" }, 'PR') : null
          );
        }.bind(this))
      )
    );
  }
});

var Toolbar = React.createClass({
  onFilter: function(e) {
    this.props.onFilter(e.target.value);
  },

  render: function() {
    return dom.div(
      { className: 'clearfix toolbar form-inline' },
      dom.div({ className: 'col-sm-6 form-group' },
              dom.label(null, 'Filter:'),
              dom.input({ className: 'form-control', 
                          value: this.props.filter,
                          onChange: this.onFilter })),
      dom.div({ className: 'col-sm-6' },
             dom.button({ className: 'btn ' + (this.props.onlyPRs ? 'btn-primary' : ''),
                          onClick: this.props.togglePRs }, 'Only PRs'))
    );
  }
});

React.renderComponent(App(), document.querySelector('.content'));
