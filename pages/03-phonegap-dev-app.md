---
layout: page
title: Installing the PhoneGap Developer App preview for Firefox OS
author: Rodrigo Silveira
author_twitter: rodms10
---

[The PhoneGap Developer App](http://app.phonegap.com/) allows PhoneGap developers to easily run their app in multiple platforms, without the need to install SDKs or have a developer subscription. You can pair your app with multiple devices at a time and any changes you make get shown on the devices.

Even though developing for Firefox OS does not require a beefy SDK or a developer subscription, being able to have your changes propagate to multiple devices at once is pretty cool!

We have started working on support for Firefox OS and you can try it out today. In this post we're going through the steps needed to get the preview version of the PhoneGap developer app in Firefox OS. As they say, a video is worth 1k images:

<div class="video">
    <iframe width="560" height="390" src="http://www.youtube.com/embed/PQOADCXB2rM" frameborder="0" allowfullscreen></iframe>
</div>

### Getting the depencies

We will be using a development version of [cordova](http://cordova.apache.org/) combined with a development version of the [PhoneGap command line interface](http://phonegap.com/) to get it all working. Luckily, they are very compatible and work well together. Let's first get all modules we'll need from github:

{% highlight bash %}
$ git clone https://github.com/apache/cordova-firefoxos.git
$ git clone https://github.com/apache/cordova-cli.git
$ git clone https://github.com/apache/cordova-lib.git
$ git clone -b fxos https://github.com/rodms10/phonegap-app-developer.git
$ git clone -b fxos https://github.com/rodms10/connect-phonegap.git
$ git clone https://github.com/phonegap/phonegap-cli.git
{% endhighlight %}

Because PhoneGap development is at version 3.5 and we need 3.6, we'll have to mix `cordova` and `phonegap` commands. Now let's set dependencies up:

{% highlight bash %}
$ cd connect-phonegap
$ npm link
$ cd ../phonegap-cli
$ npm link connect-phonegap
$ npm install
$ cd ../cordova-lib/cordova-lib
$ npm link
$ cd ../../cordova-cli
$ npm link cordova-lib
$ npm install
$ cd ..
{% endhighlight %}

### Load the app to your device

The app is available at `phonegap-app-developer/platforms/firefoxos/www/`, just point the [app manager](https://developer.mozilla.org/en-US/Firefox_OS/Using_the_App_Manager) or [webIDE](https://developer.mozilla.org/en-US/docs/Tools/WebIDE) to this path and load it to your device or simulator. When you load the app, you should see a screen with an IP address. That's where you enter the address of your server. Let's get the server going.

### Starting the server

Create a new cordova app:

{% highlight bash %}
$ cordova-cli/bin/cordova create myapp org.app.my "I Heart PhoneGap Dev App"
$ cd myapp
{% endhighlight %}

Now we need to use the development version of `cordova-firefoxos`. In your root app folder, `myapp` in our case, create a folder named `.cordova` and add a file named `config.json` with the following contents:

{% highlight json %}
{
  "lib": {
    "firefoxos": {
      "uri": "/<Full/Path/To>/cordova-firefoxos",
      "version": "dev",
      "id": "cordova-firefoxos-dev"
    }
  }
}
{% endhighlight %}

Make sure you have the correct path to `cordova-firefoxos` in the `uri` property.

Time to start the server:

{% highlight bash %}
$ ../phonegap-cli/bin/phonegap.js serve
{% endhighlight %}

You should see a line saying `[phonegap] listening on 10.0.0.1:3000`. Enter that IP in the PhoneGap Developer App and see your app start running there! Easy.
