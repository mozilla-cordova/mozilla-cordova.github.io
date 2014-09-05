---
layout: page
title: Installing the Phonegap Developer App preview for Firefox OS
author: Rodrigo Silveira
---

The Phonegap Developer App allows Phonegap developers to easily run their app in multiple platforms, without the need to install SDKs or have a developer subscription. You can pair your app with multiple devices at a time and any changes you make get instantly shown on the devices. For more information on it' usage, visit [the developer app page](http://app.phonegap.com/).

We have started working on support for Firefox OS and you can try it out today. We will be using a development version of cordova combined with a development version of the PhoneGap command line interface to get it all working. Let's first get all modules we'll need from github:

````
  $ git clone https://github.com/apache/cordova-firefoxos.git
  $ git clone https://github.com/mozilla-cordova/cordova-cli.git
  $ git clone -b fxos https://github.com/rodms10/phonegap-app-developer.git
  $ git clone -b fxos https://github.com/rodms10/connect-phonegap.git
  $ git clone -b fxos https://github.com/phonegap/phonegap-cli.git
```

Because phonegap developent is at version 3.5 and we need 3.6, we'll have to mix cordova and phonegap commands and do some hacks for phonegap to recognize your app. Now lets set dependencies up:

````
  $ cd connect-phonegap
  $ npm link
  $ cd ../phonega-cli
  $ npm link connect-phonegap
````

Load the Developer app into your Firefox OS device or the simulator. The app is available at `phonegap-app-developer/platforms/firefoxos/www/`, just point the [app manager](https://developer.mozilla.org/en-US/Firefox_OS/Using_the_App_Manager) or [webIDE](https://developer.mozilla.org/en-US/docs/Tools/WebIDE) to this path. When you load the app, you should see a screen with an IP address. That's where you enter the address of your server. Lets get the server going.

Go to your cordova app or create one:

````
  $ cordova-cli/bin/cordova create myapp org.app.my "I Heart Phonegap Dev App"
````

Now we need to use the development version of `cordova-firefoxos`. In your app folder, `myapp` in our case, create a folder named `.cordova` and add a file named `config.json` with the following contents:

````json
{
  "lib": {
    "firefoxos": {
      "uri": "/<Full/Path/To>/cordova-firefoxos",
      "version": "dev",
      "id": "cordova-firefoxos-dev"
    }
  }
}
````

Make sure you have the correct path to `cordova-firefoxos` in the `uri` property.

Time to start the server:

````
  $ cd myapp
  $ ../phonegap-cli/bin/phonegap.js serve
````

You should see a line saying `[phonegap] listening on 10.0.0.1:3000`. Enter that IP on the Phonegap Developer App in your device and see it running there! Easy.
