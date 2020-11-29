<div style="display: -ms-flexbox; display: -webkit-flex; display: flex; -webkit-flex-direction: row; -ms-flex-direction: row; flex-direction: row; -webkit-flex-wrap: wrap; -ms-flex-wrap: wrap; flex-wrap: wrap; -webkit-justify-content: center; -ms-flex-pack: center; justify-content: center; -webkit-align-content: center; -ms-flex-line-pack: center; align-content: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center;">
  <img style="-webkit-order: 0; -ms-flex-order: 0; order: 0; -webkit-flex: 0 1 auto; -ms-flex: 0 1 auto; flex: 0 1 auto; -webkit-align-self: auto; -ms-flex-item-align: auto; align-self: auto;" src="icon.png" />
</div>

<h1 style="text-align:center;">Connection Checker</h1>

## Why
Sometimes [window.navigator.onLine](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine.onLine) API is not available and we need a good way to check if we got internet connection.

## What is this?
A simple library to know the state of internet connection.

## How to use it?
First you need to import it in your project

_The require way_

```js
let { ConnectionEvent, startChecker } = require("connection-checker");
```

_The import way_

```js
import { ConnectionEvent, checkOnDemand } from "connection-checker";
```

Then use it to know your state one time on demand

```js
  window.addEventListener(ConnectionEvent.ON_NETWORK_CONNECTED, function() {
    // YOUR OWN CODE AND STUFF
  })

  checkOnDemand()
```

Or frequently (every 10 secs)

```js
  window.addEventListener(ConnectionEvent.ON_NETWORK_CHANGED, function() {
    // YOUR OWN CODE AND STUFF
  })

  startChecker()
```
You can always refer to library documentation [here](api.md)

Powered by <a href="https://deepertech.com" target="_blank">Deepertech</a>
