import { CONNECTED, DISCONNECTED } from 'Constants/States'
import { ON_NETWORK_CHECKING, ON_NETWORK_CHANGED, ON_NETWORK_CONNECTED, ON_NETWORK_DISCONNECTED } from 'Constants/Events'

let _networkState = null
let _checkerInstance = null

const _getState = () => {
  return _networkState
}
const _setState = (state) => {
  _networkState = state
}
const _resetState = () => {
  _setState(null)
}
const networkState = () => {
  return _getState()
}

class Checker {
  constructor () {
    this.networkState = null
    this.checkerInterval = null
  }

  onNetworkChecking () {
    return new Event(ON_NETWORK_CHECKING)
  }

  onNetworkChanged (data) {
    return new CustomEvent(ON_NETWORK_CHANGED, { detail: data })
  }

  onNetworkConnected () {
    return new Event(ON_NETWORK_CONNECTED)
  }

  onNetworkDisconnected () {
    return new Event(ON_NETWORK_DISCONNECTED)
  }

  _checkNetwork () {
    this._onNetworkChecking()
    return new Promise((resolve, reject) => {
      fetch('https://google.com', {
        method: 'HEAD',
        mode: 'cors',
        timeout: 2000
      }).then((response) => {
        response.ok
          ? resolve(this._evaluateNetwork(CONNECTED))
          : reject(this._evaluateNetwork(DISCONNECTED))
      }).catch(() => {
        reject(this._evaluateNetwork(DISCONNECTED))
      })
    })
  }

  _getNetworkState () {
    return this.networkState
  }

  _setNetworkState (state) {
    this.networkState = state
  }

  _resetState () {
    this._setNetworkState(null)
  }

  _hasNetworkChanged (state) {
    return this._getNetworkState() !== state
  }

  _evaluateNetwork (state) {
    this._hasNetworkChanged(state) && this._onNetworkChanged(state)
  }

  _onNetworkChecking () {
    window.dispatchEvent(this.onNetworkChecking())
  }

  _onNetworkChanged (state) {
    window.dispatchEvent(this.onNetworkChanged({ from: this._getNetworkState(), to: state }))
    state === CONNECTED ? this._onNetworkConnected() : this._onNetworkDisconnected()
  }

  _onNetworkConnected () {
    this._setNetworkState(CONNECTED)
    _setState(this._getNetworkState())
    window.dispatchEvent(this.onNetworkConnected())
  }

  _onNetworkDisconnected () {
    this._setNetworkState(DISCONNECTED)
    _setState(this._getNetworkState())
    window.dispatchEvent(this.onNetworkDisconnected())
  }

  _hasStarted () {
    return !!this.checkerInterval
  }

  _startConnectionChecker () {
    if (!this._hasStarted()) {
      this.checkerInterval = setInterval(() => {
        this._checkNetwork()
      }, 10000)
    }
  }

  _stopConnectionChecker () {
    if (this._hasStarted()) {
      clearInterval(this.checkerInterval)
      this._resetState()
    }
  }

  _checkConnectionOnDemand () {
    return this._checkNetwork()
  }
}

const _existInstance = () => {
  return !!_checkerInstance
}
const startConnectionChecker = () => {
  if (!_existInstance()) {
    _resetState()
    _checkerInstance = new Checker()
    _checkerInstance._startConnectionChecker()
  }
}
const stopConnectionChecker = () => {
  if (_existInstance()) {
    _checkerInstance._stopConnectionChecker()
    _checkerInstance = null
  }
}
const checkConnectionOnDemand = () => {
  let instance = new Checker()
  instance._checkConnectionOnDemand()
    .finally(() => {
      instance = null
    })
}

export {
  networkState,
  startConnectionChecker,
  stopConnectionChecker,
  checkConnectionOnDemand
}
