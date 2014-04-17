
var dom = React.DOM;

var App = React.createClass({
  getInitialState: function() {
    return { issues: [],
             repos: [] };
  },

  componentDidMount: function() {
    var issues = [],
      repos = [];

    if(window.CORDOVA_STATUS) {
      issues = issues.concat(CORDOVA_STATUS.issues.map(function(issue) {
        issue.created_at = new Date(issue.created_at);
        issue.updated_at = new Date(issue.updated_at);
        issue.origin = 'github';
        return issue;
      }));

      repos = window.CORDOVA_STATUS.repos;
    }

    if(window.JIRA_ISSUES) {
      issues = issues.concat(JIRA_ISSUES.issues.map(function(issue) {
        issue.created_at = new Date(issue.fields.created);
        issue.updated_at = new Date(issue.fields.updated);
        issue.title = issue.fields.summary;
        issue.html_url = 'https://issues.apache.org/jira/browse/' + issue.key;
        issue.origin = 'jira';
        issue.status = issue.fields.status.name;
        return issue;
      }));
    }

    this.setState({ issues: issues,
      repos: repos });
  },

  render: function() {
    return dom.div(
      { className: 'app' },
      dom.h1(null, 'Repos'),
      RepoList({ repos: this.state.repos }),
      dom.h1(null, 'Issues'),
      IssueList({ issues: this.state.issues })
    );
  }
});

var IssueList = React.createClass({
  getInitialState: function() {
    return { onlyPRs: false,
             filter: '' };
  },

  togglePRs: function() {
    this.setState({ onlyPRs: !this.state.onlyPRs });
  },

  applyFilter: function(value) {
    this.setState({ filter: value });
  },
  
  render: function() {
    var s = this.state;
    var issues = Array.prototype.slice.call(this.props.issues);
    issues.sort(function(a, b) {
      return a.updated_at < b.updated_at ? 1 : -1;
    });

    return dom.div(
      null,
      Toolbar({ togglePRs: this.togglePRs,
                onlyPRs: s.onlyPRs,
                onFilter: this.applyFilter,
                filter: this.state.filter.toLowerCase() }),
      dom.ul(
        { className: 'issues' },
        issues.map(function(issue) {
          if(s.onlyPRs && !issue.pull_request.html_url) {
            return null;
          }

          if(s.filter && 
             issue.title.toLowerCase().indexOf(s.filter) === -1 &&
            (!issue.repo || issue.repo.toLowerCase().indexOf(s.filter) === -1)) {
            return null;
          }

          return dom.li(
            { className: 'issue' },
            dom.i({ className: "icon " + issue.origin }),
            dom.a(
              { href: issue.html_url },
              issue.title + ' (' + moment(issue.updated_at).format('MM-DD-YYYY') + ')'
            ),
            issue.repo ?
              dom.span({ className: "label label-default" }, issue.repo) :
              dom.span({ className: "label label-info" }, issue.status),
            (issue.pull_request && issue.pull_request.html_url) ?
              dom.span({ className: "label label-danger" }, 'PR') : null
          );
        }.bind(this))
      )
    );
  }
});

var RepoList = React.createClass({
  render: function() {
    return dom.ul(
      null,
      this.props.repos.map(function(repo) {
        return dom.li(
          null,
          dom.a({ href: "http://github.com/mozilla-cordova/" + repo.repo },
                repo.repo),
          ' ',
          (repo.status.indexOf('out-of-date') !== -1 ? 
           dom.span({ className: 'label label-danger' }, 'out-of-date') :
           null),
          ' ',
          (repo.status.indexOf('new-commits') !== -1 ? 
           dom.span({ className: 'label label-success' }, 'new-commits') :
           null)
        );
      })
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
