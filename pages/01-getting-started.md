---
layout: page
title: Getting Started
author: Rodrigo Silveira
author_twitter: rodms10
---

Thank you for your interest in contributing to Firefox OS Cordova initiative!

[Cordova](http://cordova.apache.org/) is an open source toolset for writing multi-platform native mobile applications using web technology. Cordova provides you with standards based JavaScript APIs and the plumbing necessary to access the device's internals, such as battery status, GPS and camera. Each mobile operating system has its own platform implementation for doing the communication between cordova's JavaScript API and the native OS code.

This documentation is aimed at developers who want to understand the inner workings of Cordova. To learn more about how to use cordova to create a Firefox OS app, check out [our MDN page](https://developer.mozilla.org/en-US/Apps/Tools_and_frameworks/Cordova_support_for_Firefox_OS).

Cordova is written in [node.js](http://nodejs.org/), you just need to understand JavaScript to work on it.

## The repositories

Cordova code is organized into multiple repositories. The main ones you need to be aware of for Firefox OS development are `cordova-cli`, `cordova-firefoxos` and `cordova-plugin-*`. Here is a brief description of them:

- `cordova-cli` - is where the entry point code for the command line tools is located. There is no platform specific code here; most of the functionality lives in `cordova-lib`.
- `cordova-lib` - contains modules used mainly by `cordova-cli`. There is some platform specific code under `cordova-lib/src/cordova/metadata` which are config parsers. Firefox OS uses it to get the initial version of the manifest with the correct app name and other values.
- `cordova-firefoxos` - is the repository for the Firefox OS platform tools. The code here is responsible for handling Firefox OS Cordova commands.
- `cordova-plugin-*` - are repositories for plugins. A plugin repository contains code for each supported platform too.

## Running it locally

To work on the platform, you need to run the latest code from the repositories. It's super helpful to run Cordova entirely from local files so that you can edit code and see the effects. With the multiple repository structure used by Cordova, this can be tricky.

Make sure you have [git](http://git-scm.com/downloads) and [node.js](http://nodejs.org/download/) installed. A [GitHub](https://github.com/) account will be handy if you plan to send us your changes. The prompt samples below are using bash, modify accordingly for Windows.

_Note: On Linux and OS X you may need to prefix some npm commands with `sudo`. See [this stackoverflow thread for more info](https://developer.mozilla.org/en-US/Apps/Tools_and_frameworks/Cordova_support_for_Firefox_OS)_

### cordova-cli & cordova-lib

First, let's get `cordova-cli` and `cordova-lib` from Apache's GitHub repository. From the directory you'd like to keep Cordova code run:

{% highlight bash %}
$ git clone https://github.com/apache/cordova-cli.git
$ git clone https://github.com/apache/cordova-lib.git
{% endhighlight %}

Now we install dependencies and link both together with [npm link](https://www.npmjs.org/doc/cli/npm-link.html):

{% highlight bash %}
$ cd cordova-lib/cordova-lib
$ npm link
$ cd ../../cordova-cli
$ npm link cordova-lib
$ npm install
$ cd ..
{% endhighlight %}

The executable `cordova` script is located at `cordova-cli/bin/cordova`. This is the executable we'll use for all our Cordova command line needs from now on. You can add it to your `PATH` if you want, but I'll use the relative path for clarity.

### cordova-firefoxos

Next, let's clone the Firefox OS platform bits from the `cordova-firefoxos` repository. Change to the directory where you store your code, and run:

{% highlight bash %}
$ git clone https://github.com/apache/cordova-firefoxos.git
{% endhighlight %}

You don't need to run `npm install` on this newly cloned repository to install dependencies for `cordova-firefoxos`, because they're already part of the repository.

### Creating an app

We can now create a Cordova app by running `cordova create`. Move to your projects directory, and then run the following to create the app in a new `myapp` folder, giving it the even more original project name of `io.myapp` and naming it `myapp`:

{% highlight bash %}
$ cordova-cli/bin/cordova create myapp io.myapp "My Cordova app"
$ cd myapp
{% endhighlight %}

We need to use a little trick to let Cordova know that it should use the local `cordova-firefoxos` when working with our newly created app:


In your project directory (i.e. `myapp`), create a folder called `.cordova`, and inside it create a file named `config.json` with the following contents:

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

Make sure to set the full path to `cordova-firefoxos` folder on the `uri` property.

To add the platform, all you need to run is:

{% highlight bash %}
$ ../cordova-cli/bin/cordova platform add firefoxos
{% endhighlight %}

That's it. If you make any changes to `cordova-firefoxos`, remove and add the platform again to make sure you have the latest:

{% highlight bash %}
$ ../cordova-cli/bin/cordova platform remove firefoxos
$ ../cordova-cli/bin/cordova platform add firefoxos
{% endhighlight %}

### Plugins

Working with local plugins is much simpler. Let's download the contacts plugin as an example:

{% highlight bash %}
$ cd ..
$ git clone https://github.com/apache/cordova-plugin-contacts.git
{% endhighlight %}

Adding a local version is pretty simple, just add the path as parameter to `cordova plugin add` command:

{% highlight bash %}
$ cd myapp
$ ../cordova-cli/bin/cordova plugin add ../cordova-plugin-contacts
{% endhighlight %}

To see the changes you made to plugin code, you have to remove and then add the plugin again. To remove the plugin you need to use the plugin name, not the path. Running `../cordova-cli/bin/cordova plugin ls` will show you the names of installed plugins. For example, to remove the contacts plugin run `../cordova-cli/bin/cordova plugin remove org.apache.cordova.contacts`.

That's it, you are now running the latest and greatest versions of it all!
