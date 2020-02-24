<div style="display: -ms-flexbox; display: -webkit-flex; display: flex; -webkit-flex-direction: row; -ms-flex-direction: row; flex-direction: row; -webkit-flex-wrap: wrap; -ms-flex-wrap: wrap; flex-wrap: wrap; -webkit-justify-content: center; -ms-flex-pack: center; justify-content: center; -webkit-align-content: center; -ms-flex-line-pack: center; align-content: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center;">
  <img style="-webkit-order: 0; -ms-flex-order: 0; order: 0; -webkit-flex: 0 1 auto; -ms-flex: 0 1 auto; flex: 0 1 auto; -webkit-align-self: auto; -ms-flex-item-align: auto; align-self: auto;" src="icon.png" />
</div>

<h1 style="text-align:center;">Connection Checker</h1>

## What ?
A simple library to know the state of internet connection.

## How to use it?

First you need to import it in your project

- The require way

```js
let { ConnectionEvent, startConnectionChecker } = require("connection-checker");
```

- The import way

```js
import { ConnectionEvent, checkConnectionOnDemand } from "connection-checker";
```
.
.
.

Then use it to know your state one time on demand

```js
  import { ConnectionEvent, checkConnectionOnDemand } from "connection-checker";

  window.addEventListener(ConnectionEvent.ON_NETWORK_CONNECTED, function() {
    // YOUR OWN CODE AND STUFF
  })

  checkConnectionOnDemand()
```


Or frequently (every 10 secs)

```js
  import { ConnectionEvent, startConnectionChecker } from "connection-checker";

  window.addEventListener(ConnectionEvent.ON_NETWORK_CHANGED, function() {
    // YOUR OWN CODE AND STUFF
  })

  startConnectionChecker()
```

Powered by <a href="https://deepertech.com" target="_blank">Deepertech</a>
