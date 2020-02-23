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
const connectionState = () => {
  return _getState()
}

class Checker {
  constructor () {
    this.networkState = null
    this.onNetworkChecking = new Event(ON_NETWORK_CHECKING)
    this.onNetworkChanged = new Event(ON_NETWORK_CHANGED)
    this.onNetworkConnected = new Event(ON_NETWORK_CONNECTED)
    this.onNetworkDisconnected = new Event(ON_NETWORK_DISCONNECTED)
    this.checkerInterval = null
  }

  _checkNetwork () {
    return new Promise((resolve, reject) => {
      fetch('https://google.com', {
        method: 'HEAD',
        mode: 'cors',
        timeout: 2000
      }).then((response) => {
        response.ok
          ? resolve()
          // eslint-disable-next-line prefer-promise-reject-errors
          : reject()
      }).catch(() => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject()
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
    window.dispatchEvent(this.onNetworkChecking)
  }

  _onNetworkChanged (state) {
    window.dispatchEvent(this.onNetworkChanged, { fromState: this._getNetworkState(), toState: state })
    state === CONNECTED ? this._onNetworkConnected() : this._onNetworkDisconnected()
  }

  _onNetworkConnected () {
    this._setNetworkState(CONNECTED)
    _setState(this._getNetworkState())
    window.dispatchEvent(this.onNetworkConnected)
  }

  _onNetworkDisconnected () {
    this._setNetworkState(DISCONNECTED)
    _setState(this._getNetworkState())
    window.dispatchEvent(this.onNetworkDisconnected)
  }

  _hasStarted () {
    return !!this.checkerInterval
  }

  _startConnectionChecker () {
    if (!this._hasStarted()) {
      this.checkerInterval = setInterval(
        this._checkNetwork()
          .then(this._evaluateNetwork(CONNECTED))
          .catch(this._evaluateNetwork(DISCONNECTED))
        , 5000)
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
      .then(this._evaluateNetwork(CONNECTED))
      .catch(this._evaluateNetwork(DISCONNECTED))
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
    .finaly(() => {
      instance = null
    })
}

export {
  connectionState,
  startConnectionChecker,
  stopConnectionChecker,
  checkConnectionOnDemand
}
