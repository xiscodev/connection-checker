import { CONNECTED, DISCONNECTED } from 'Constants/States'
import { ON_NETWORK_CHECKING, ON_NETWORK_CHANGED, ON_NETWORK_CONNECTED, ON_NETWORK_DISCONNECTED } from 'Constants/Events'

let _networkState = null
let _checkerInstance = null

/**
 * @access private
 * @function _getState
 * @description Retrieves the stored network state.
 * @returns {NetworkState}
 */
const _getState = () => {
  return _networkState
}

/**
 * @access private
 * @function _setState
 * @description Set _networkState value to state.
 * @param {NetworkState} state
 */
const _setState = (state) => {
  _networkState = state
}

/**
 * @access private
 * @function _resetState
 * @description Reset _networkState value.
 */
const _resetState = () => {
  _setState(null)
}

/**
 * @access protected
 * @description Contains the main logic part of the connection checker library.
 * @class Checker
 */
class Checker {
  /**
   * @access protected
   * @description Creates an instance of Checker.
   * @constructs
   * @memberof Checker
   */
  constructor () {
    /**
     * @description Represents the network state stored, it can be CONNECTED, DISCONNECTED or null.
     * @property {NetworkState}
    */
    this.networkState = null
    /**
     * @description Stores the generated interval for checker.
     * @property {number}
    */
    this.checkerInterval = null
  }

  /**
   * @access private
   * @function onNetworkChecking
   * @description Retrieves a Checker#ON_NETWORK_CHECKING event.
   * @returns {Event}
   * @memberof Checker
   */
  onNetworkChecking () {
    return new Event(ON_NETWORK_CHECKING)
  }

  /**
   * @access private
   * @function onNetworkChanged
   * @description Retrieves a Checker#ON_NETWORK_CHANGED custom event, with an object containing network states 'from' and 'to'.
   * @param {Object} data
   * @returns {CustomEvent}
   * @memberof Checker
   */
  onNetworkChanged (data) {
    return new CustomEvent(ON_NETWORK_CHANGED, { detail: data })
  }

  /**
   * @access private
   * @function onNetworkConnected
   * @description Retrieves a Checker#ON_NETWORK_CONNECTED event.
   * @returns {Event}
   * @memberof Checker
   */
  onNetworkConnected () {
    return new Event(ON_NETWORK_CONNECTED)
  }

  /**
   * @access private
   * @function onNetworkDisconnected
   * @description Retrieves a Checker#ON_NETWORK_DISCONNECTED event.
   * @returns {Event}
   * @memberof Checker
   */
  onNetworkDisconnected () {
    return new Event(ON_NETWORK_DISCONNECTED)
  }

  /**
   * @access private
   * @function _checkNetwork
   * @description Executes Checker#ON_NETWORK_CHECKING event dispatcher, generates a Promise
   * which resolves or rejects depending on the resolution of fetch requesting a remote server.
   * @returns {Promise}
   * @memberof Checker
   */
  _checkNetwork () {
    this._dispatchNetworkChecking()
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

  /**
   * @access private
   * @function _getNetworkState
   * @description Retrieves networkState value.
   * @returns {NetworkState}
   * @memberof Checker
   */
  _getNetworkState () {
    return this.networkState
  }

  /**
   * @access private
   * @function _setNetworkState
   * @description Assigns state value to networkState.
   * @param {NetworkState} state
   * @memberof Checker
   */
  _setNetworkState (state) {
    this.networkState = state
  }

  /**
   * @access private
   * @function _resetState
   * @description Resets the networkState value to origin.
   * @memberof Checker
   */
  _resetState () {
    this._setNetworkState(null)
  }

  /**
   * @access private
   * @function _hasNetworkChanged
   * @description Validates if there has been a change on network state.
   * @param {NetworkState} state
   * @returns {boolean}
   * @memberof Checker
   */
  _hasNetworkChanged (state) {
    return this._getNetworkState() !== state
  }

  /**
   * @access private
   * @function _evaluateNetwork
   * @description Evaluates state to execute the Checker#ON_NETWORK_CHANGED event dispatcher if conditions are valid.
   * @param {NetworkState} state
   * @memberof Checker
   */
  _evaluateNetwork (state) {
    this._hasNetworkChanged(state) && this._dispatchNetworkChanged(state)
  }

  /**
   * @access private
   * @function _dispatchNetworkChecking
   * @description Method that emits an event Checker#ON_NETWORK_CHECKING.
   * @fires Checker#ON_NETWORK_CHECKING
   * @memberof Checker
   */
  _dispatchNetworkChecking () {
    window.dispatchEvent(this.onNetworkChecking())
  }

  /**
   * @access private
   * @function _dispatchNetworkChanged
   * @description Emits an ON_NETWORK_CHANGED event with states changed 'from' and 'to', then validates
   * state to execute dispatchers of Checker#ON_NETWORK_CONNECTED or Checker#ON_NETWORK_DISCONNECTED events.
   * @fires Checker#ON_NETWORK_CHANGED
   * @param {NetworkState} state
   * @memberof Checker
   */
  _dispatchNetworkChanged (state) {
    window.dispatchEvent(this.onNetworkChanged({ from: this._getNetworkState(), to: state }))
    state === CONNECTED ? this._dispatchNetworkConnected() : this._dispatchNetworkDisconnected()
  }

  /**
   * @access private
   * @function _dispatchNetworkConnected
   * @description Emits an Checker#ON_NETWORK_CONNECTED event.
   * @fires Checker#ON_NETWORK_CONNECTED
   * @memberof Checker
   */
  _dispatchNetworkConnected () {
    this._setNetworkState(CONNECTED)
    _setState(this._getNetworkState())
    window.dispatchEvent(this.onNetworkConnected())
  }

  /**
   * @access private
   * @function _dispatchNetworkDisconnected
   * @description Emits an Checker#ON_NETWORK_DISCONNECTED event.
   * @fires Checker#ON_NETWORK_DISCONNECTED
   * @memberof Checker
   */
  _dispatchNetworkDisconnected () {
    this._setNetworkState(DISCONNECTED)
    _setState(this._getNetworkState())
    window.dispatchEvent(this.onNetworkDisconnected())
  }

  /**
   * @access private
   * @function _isCheckerActive
   * @description Checks if there is an active checker.
   * @returns {boolean}
   * @memberof Checker
   */
  _isCheckerActive () {
    return !!this.checkerInterval
  }

  /**
   * @access protected
   * @function _startConnectionChecker
   * @description Starts the periodical execution of network validations.
   * @memberof Checker
   */
  _startConnectionChecker () {
    if (!this._isCheckerActive()) {
      this.checkerInterval = setInterval(() => {
        this._checkNetwork()
      }, 10000)
    }
  }

  /**
   * @access protected
   * @function _stopConnectionChecker
   * @description Stops any periodical execution of network validations and resets network state.
   * @memberof Checker
   */
  _stopConnectionChecker () {
    if (this._isCheckerActive()) {
      clearInterval(this.checkerInterval)
      this._resetState()
    }
  }

  /**
   * @access protected
   * @function _checkConnectionOnDemand
   * @description Executes _checkNetwork method and retrieves its Promise result once.
   * @returns {Promise}
   * @memberof Checker
   */
  _checkConnectionOnDemand () {
    return this._checkNetwork()
  }
}

/**
 * @access public
 * @function networkState
 * @description Retrieves the stored network state.
 * @returns {NetworkState}
 */
const networkState = () => {
  return _getState()
}

/**
 * @access public
 * @function isCheckerActive
 * @description Checks if exist an instance of Checker class.
 * @returns {boolean}
 */
const isCheckerActive = () => {
  return !!_checkerInstance
}

/**
 * @access public
 * @function startConnectionChecker
 * @description Generates an instance of a Checker which keeps executing network validations.
 */
const startConnectionChecker = () => {
  if (!isCheckerActive()) {
    _resetState()
    _checkerInstance = new Checker()
    _checkerInstance._startConnectionChecker()
  }
}

/**
 * @access public
 * @function stopConnectionChecker
 * @description Stops the execution of network validations and destroys active instance of Checker.
 */
const stopConnectionChecker = () => {
  if (isCheckerActive()) {
    _checkerInstance._stopConnectionChecker()
    _checkerInstance = null
  }
}

/**
 * @access public
 * @function checkConnectionOnDemand
 * @description Creates instance of Checker, execute a network validation once, and destroys the created instance.
 */
const checkConnectionOnDemand = () => {
  let instance = new Checker()
  instance._checkConnectionOnDemand()
    .finally(() => {
      instance = null
    })
}

export {
  networkState,
  isCheckerActive,
  startConnectionChecker,
  stopConnectionChecker,
  checkConnectionOnDemand
}
