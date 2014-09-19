---
layout: page
title: Plugin development tips
author: Rodrigo Silveira
author_twitter: rodms10
---

Cordova provides you with a javascript API. They try to follow standards when possible. Firefox OS is built on web standards too. Sometimes they use the same API. How can a plugin developer access Firefox OS API when they clash?

Cordova provides us with a `modulemapper` library to access the original values of overwritten properties. Let's take a look at how the [battery-status plugin uses `modulemapper`](https://github.com/apache/cordova-plugin-battery-status/blob/7222959f2741cc54401c84c4506413001684e799/src/firefoxos/BatteryProxy.js#L22):

{% highlight js %}
var mozBattery = cordova.require('cordova/modulemapper').getOriginalSymbol(window, 'navigator.battery');
{% endhighlight %}

The variable `mozBattery` now points to the original `navigator.battery`. The first parameter to `getOriginalSymbol` is the context, pretty much always  `window`. The second is the value you want to get. To find out what value to use on the second parameter, check the `<js-module>` element in the plugin's `plugin.xml` configuration file. For the [battery-status plugin it is](https://github.com/apache/cordova-plugin-battery-status/blob/7222959f2741cc54401c84c4506413001684e799/plugin.xml#L31-L33):

{% highlight xml %}
<js-module src="www/battery.js" name="battery">
    <clobbers target="navigator.battery" />
</js-module>
{% endhighlight %}

The `<clobbers>` element's `target` attribute has the value that was overwritten.
