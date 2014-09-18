---
layout: page
title: Contributing to FirefoxOS Cordova initiative
author: Rodrigo Silveira
author_twitter: rodms10
---

After the project I was working on [got cancelled](https://blog.mozilla.org/futurereleases/2014/03/14/metro/), I started contributing to [Firefox OS Cordova project](https://wiki.mozilla.org/CordovaFirefoxOS). [Cordova](http://cordova.apache.org/) is an open source framework for writing multi-platform native mobile applications using web technology. Cordova provides you with javascript APIs and the plumbing necessary to access the device's internals, such as battery status, GPS and camera. Neat stuff. Each mobile operating system has its own platform implementation for doing the communication between cordova's javascript API and the native OS code.

This post will focus on how to get started writing the Firefox OS platform and plugins. To get a better understanding on how to use cordova to write a Firefox OS app, I highly recommend the [mozilla hacks post](https://hacks.mozilla.org/2014/02/building-cordova-apps-for-firefox-os/) on the subject.

Cordova is written in [node.js](http://nodejs.org/), you just need to understand javascript to work on it. It took me much code digging and asking around to get started, but you won't have to!

## The repositories

Cordova code is organized into multiple repositories. The main ones you need to be aware of for Firefox OS development are `cordova-cli`, `cordova-firefoxos` and `cordova-plugin-*`. Here is a brief description of them:

- `cordova-cli` - is where the code for the command line tools is located. There is some platform specific code under `src/metadata` which are config parsers. Firefox OS uses it to get the initial version of the manifest with the correct app name and other values.
- `cordova-firefoxos` - is the repository for the Firefox OS platform tools. The code here is responsible for handling Firefox OS cordova commands and for the initial skeletal app.
- `cordova-plugin-*` - are repositories for plugins. A plugin repository contains code for each supported platform too.

## Running it locally

To work on the platform, you need to run on the latest code from the repositories. It's super helpful to run cordova entirely from local files so that you can edit code and see the effects. With the multiple repository organization used by cordova, this can be tricky. Make sure you have [git](http://git-scm.com/downloads) and [node.js](http://nodejs.org/download/) installed. A [github](https://github.com/) account will be handy if you plan to send us your changes. The prompt samples below are using bash.

First lets get `cordova-cli` from mozilla-cordova github account and install the dependencies. From the directory you'd like to keep cordova code run:

{% highlight bash %}
$ git clone https://github.com/mozilla-cordova/cordova-cli.git
$ cd cordova-cli
$ npm install
$ cd ..
{% endhighlight %}

The cordova binary is located at `cordova-cli/bin/cordova`. From now on this is the binary we'll use for all our cordova command line needs. You can add it to your `PATH` if you want, I'll use the relative path for clarity. Next let's clone Firefox OS platform bits from `cordova-firefoxos` repository:

{% highlight bash %}
$ git clone https://github.com/mozilla-cordova/cordova-firefoxos.git
{% endhighlight %}

No need to install dependencies for `cordova-firefoxos`, they're already part of the repository. Before creating an app, there's a little trick to tell cordova to use the local platform code we just downloaded. Create a file named `firefoxos.json` with the following contents:

{% highlight json %}
{
    "lib": {
        "firefoxos": {
            "uri": "/<FULL PATH TO>/cordova-firefoxos",
            "version": "dev",
            "id": "cordova-firefoxos-dev"
        }
    }
}
{% endhighlight %}

Make sure to set the full path to `cordova-firefoxos` folder under `uri`. We can now create a new cordova app by running `create`. Let's create the app in `myapp` folder and give it the even more original project name of `io.myapp` and name it `myapp`. The fourth parameter to `create` is the json config file we just create as a string. To create the app run:

{% highlight bash %}
$ cordova-cli/bin/cordova create myapp io.myapp myapp "$(cat firefoxos.json)"
$ cd myapp
{% endhighlight %}

Alternatively, to use a local copy of `cordova-firefoxos` platform code on a cordova app that already exists, you can create a json file with the same content as above under `yourapp/.cordova/config.json`. In fact, that fourth parameter created that file for you. Go check.

To add the platform, all you need to run is:

{% highlight bash %}
$ ../cordova-cli/bin/cordova platform add firefoxos
{% endhighlight %}

That's it. If you make any changes to `cordova-firefoxos`, remove and add the platform again to make sure you have the latest.

## Adding a plugin

Working with local plugins is much simpler. Lets download the contacts plugin as an exemple:

{% highlight bash %}
$ cd ..
$ git clone https://github.com/mozilla-cordova/cordova-plugin-contacts.git
{% endhighlight %}

Adding a local version is pretty simple, just add the path as parameter to `plugin add` command:

{% highlight bash %}
$ cd myapp
$ ../cordova-cli/bin/cordova plugin add ../cordova-plugin-contacts
{% endhighlight %}

*NOTE: if at this point you hit a `ReferenceError: xml_helpers is not defined` error, don't despair. [It's a bug](https://issues.apache.org/jira/browse/CB-6200) in `cordova-plugman` code, which is responsible for plugin management. We can fix it by getting the latest version of `cordova-plugman`, and making sure cordova-cli uses it too. Here's how:*

{% highlight bash %}
$ cd ..
$ git clone https://github.com/apache/cordova-plugman.git
$ cd cordova-cli
$ npm install ../cordova-plugman
$ cd ../myapp
$ ../cordova-cli/bin/cordova plugin add ../cordova-plugin-contacts
{% endhighlight %}

To see changes you made to plugin code you have to remove then add the plugin again. To remove the plugin you need to use the plugin name, not the path. Running `../cordova-cli/bin/cordova plugin ls` will show you the names of installed plugins. For example, to remove the contacts plugin run `../cordova-cli/bin/cordova plugin remove org.apache.cordova.contacts`.

That's it, you are now running the latest and greatest versions of it all!

## Firefox OS plugin development: from javascript to javascript

Cordova provides you with a javascript API. They try to follow standards when possible. Firefox OS is built on web standards too. Sometimes they use the same API. How can a plugin developer access Firefox OS API when they clash?

Cordova provides us with a `modulemapper` library to access the original values of overwritten properties. Let's take a look at how the [battery-status plugin uses `modulemapper`](https://github.com/mozilla-cordova/cordova-plugin-battery-status/blob/dev/src/firefoxos/BatteryProxy.js#L22):

{% highlight js %}
var mozBattery = cordova.require('cordova/modulemapper').getOriginalSymbol(window, 'navigator.battery');
{% endhighlight %}

The variable `mozBattery` now points to the original `navigator.battery`. The first parameter to `getOriginalSymbol` is the context, pretty much always  `window`. The second is the value you want to get. To find out what value to use on the second parameter, check the `<js-module>` element in the plugin's `plugin.xml` configuration file. For the [battery-status plugin it is](https://github.com/mozilla-cordova/cordova-plugin-battery-status/blob/dev/plugin.xml#L14-L16):

{% highlight xml %}
<js-module src="www/battery.js" name="battery">
    <clobbers target="navigator.battery" />
</js-module>
{% endhighlight %}

The `<clobbers>` element's `target` attribute has the value that was overwritten.

## Contributing

If you got this far, you're ready to get started! Open up your favorite editor and hack on. If you want to help with Firefox OS support, check out [our status site](http://mozilla-cordova.github.io/) and [the project's wiki](https://wiki.mozilla.org/CordovaFirefoxOS).

While writing this post I got news that I'm joining the team. Super excited to improve cordova support for Firefox OS! If you want to chat with us, we hang out on #cordova channel on [mozilla's irc server](https://wiki.mozilla.org/IRC).
