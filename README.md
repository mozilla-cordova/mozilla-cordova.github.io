This is the repository for Mozilla cordova site served at http://mozilla-cordova.github.io/. It contains two core pages, 
the welcome page and the [status page](http://mozilla-cordova.github.io/status/index.html).

The welcome page is intended for general public with information on how to use cordova on Firefox OS. The status page
is intended for platform developers. It shows development status for platform and plugins, plus an aggregate of all 
issues/PRs across the cordova repositories.

## Building the site

The site is built using [github's jekyll](https://help.github.com/articles/using-jekyll-with-pages). To run the site
locally, run:

```
$ bundle exec jekyll serve --watch
```

Then navigate to `http://localhost:4000`.

## Status page

The status page requires a service to aggregate jira and github issues. The service also gathers development status
information from github. For more information on running the service, see
[the github repository](https://github.com/mozilla-cordova/status-server).
