This is a repo for Mozilla to track our Cordova work. We do all of our
work inside the `mozilla-cordova` organization on github. Each Cordova
plugin is a separate repo forked from the official Apache repo.

## Installing Plugins

If you want to test our dev version of a plugin, you can
install it like this:

```
$ cordova plugin add https://github.com/mozilla-cordova/cordova-plugin-camera.git
```

We frequently push our work to the official Apache repos, so you only
need to do that if you want the latest and greated. Updates will be
pushed weekly on average.

If you just need the latest released version, just simply do `cordova
plugin add org.apache.cordova.camera`. Replace "camera" with any of
the plugins above.

## Contributing

To contribute, fork any of the plugin repos and open PRs. It's best to
let us know if you do that, by opening an issue here, or contact us in
`#apps` on irc.mozilla.org.

## Status

Plugin Status (see the individual plugin docs for details):

* [camera](https://github.com/mozilla-cordova/cordova-plugin-camera) - partial (many of the settings are ignore)
* [contacts](https://github.com/mozilla-cordova/cordova-plugin-contacts) - partial (read-only)
* [device](https://github.com/mozilla-cordova/cordova-plugin-device) - partial (most device properties are null)
* [device-motion](https://github.com/mozilla-cordova/cordova-plugin-device-motion) - full (needs to be confirmed)
* [device-orientation](https://github.com/mozilla-cordova/cordova-plugin-device-orientation) - mostly (one option is ignored)
* [geolocation](https://github.com/mozilla-cordova/cordova-plugin-geolocation) - full
* [vibration](https://github.com/mozilla-cordova/cordova-plugin-vibration) - full

Missing plugins:

* battery status
* filesystem
* file transfer
* globalization
* in app browser
* media
* media capture
* network information
* splash screen