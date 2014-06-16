"use strict";

var dom = React.DOM;

var IssueList = React.createClass({
    getInitialState: function() {
        return { onlyPRs: false,
            filter: '',
            issues: [] };
    },

    togglePRs: function() {
        this.setState({ onlyPRs: !this.state.onlyPRs });
    },

    applyFilter: function(value) {
        this.setState({ filter: value });
    },

    componentDidMount: function() {
        var issues = [];

        if (window.CORDOVA_STATUS) {
            issues = issues.concat(CORDOVA_STATUS.issues.map(function(issue) {
                issue.created_at = new Date(issue.created_at);
                issue.updated_at = new Date(issue.updated_at);
                issue.origin = 'github';
                return issue;
            }));

        }

        if (window.JIRA_ISSUES) {
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

        this.setState({ issues: issues });
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
                filter: this.state.filter.toLowerCase() }),
            dom.div(
                { className: 'issues list-group' },
                issues.map(function(issue) {
                    if (s.onlyPRs && (!issue.pull_request || !issue.pull_request.html_url)) {
                        return null;
                    }

                    if (s.filter &&
                        issue.title.toLowerCase().indexOf(s.filter) === -1 &&
                        (!issue.repo || issue.repo.toLowerCase().indexOf(s.filter) === -1)) {
                        return null;
                    }

                    return dom.a(
                        {
                            className: 'issue list-group-item',
                            href: issue.html_url
                        },
                        dom.i({ className: "icon " + issue.origin }),
                        dom.span(
                            null,
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
    getInitialState: function() {
        return { issues: [],
            repos: [] };
    },

    componentDidMount: function() {
        this.setState({ repos: window.CORDOVA_STATUS.repos || [] });
    },

    render: function() {
        var repos = this.state.repos.sort(function(a, b) {
            return a.repo.localeCompare(b.repo);
        });

        return dom.div(
            null,
            repos.map(function(repo) {
                var nodes = [],
                    topicBranches = [],
                    prs = [];

                nodes.push(dom.div({ className: '4u'},
                    dom.a({ href: "http://github.com/apache/" + repo.repo },
                        repo.repo)
                ));

                if (repo.topicBranches && repo.topicBranches.length > 0) {
                    repo.topicBranches.forEach(function(topic) {
                        topicBranches.push(dom.a({
                            className: 'label label-warning',
                            href: 'https://github.com/mozilla-cordova/' + repo.repo + '/compare/mozilla-dev...' + topic
                        }, topic));
                    });
                }

                nodes.push(dom.div({ className: '3u'}, topicBranches.length && topicBranches || dom.span(null, 'none')));

                if (repo.mozPullRequests && repo.mozPullRequests.length > 0) {

                    prs.push(dom.span(null, 'to mozilla-cordova:'));

                    repo.mozPullRequests.forEach(function(pr) {
                        prs.push(
                            dom.div({ className: 'truncate'},
                                dom.a({href: pr.user_url}, pr.user),
                                ': ',
                                dom.a({href: pr.url, title: pr.title}, pr.title)
                            ));
                    });
                }

                if (repo.apachePullRequests && repo.apachePullRequests.length > 0) {

                    prs.push(dom.span(null, 'to apache:'));

                    repo.apachePullRequests.forEach(function(pr) {
                        prs.push(
                            dom.div({ className: 'truncate'},
                                dom.a({href: pr.user_url}, pr.user),
                                ': ',
                                dom.a({href: pr.url, title: pr.title}, pr.title)
                            ));
                    });
                }

                nodes.push(dom.div({ className: '5u'}, prs.length && prs || dom.span(null, 'none')));

                return dom.div({ className: 'row flush list-group-item' }, nodes);
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
                dom.button({ className: 'btn ' + (this.props.onlyPRs ? 'btn-warning' : 'btn-info'),
                    onClick: this.props.togglePRs }, 'Only PRs'))
        );
    }
});

React.renderComponent(RepoList(), document.getElementById('repos'));
React.renderComponent(IssueList(), document.getElementById('issues'));
