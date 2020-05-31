import ConnectionState from 'Constants/States'
import { REMOTE_RESOURCE, REQUEST_TIMEOUT_TIME, REQUEST_INTERVAL_TIME } from 'Constants/Defaults'
import { onNetworkChecking, onNetworkChanged, onNetworkConnected, onNetworkDisconnected } from 'NetworkEventEmitter'

/**
 * @access private
 * @description Stores the connection state
 * @type {ConnectionState|NULL}
 */
let _connectionState = null,

  /**
   * @access private
   * @description Stores the checker instance
   * @type {number|NULL}
   */
  _checkerInstance = null,

  /**
   * @access private
   * @description Fetch timeout set by user
   * @type {number|NULL}
   */
  _fetchTimeout = null,

  /**
   * @access private
   * @description Interval time to launch fewtch requests set by user
   * @type {number|NULL}
   */
  _intervalTime = null

/**
 * @access private
 * @function _getState
 * @description Retrieves the stored connection state.
 * @returns {ConnectionState}
 */
const _getState = () => {
    return _connectionState
  },

  /**
   * @access private
   * @function _setState
   * @description Set _connectionState value to state.
   * @param {ConnectionState|NULL} state
   */
  _setState = (state) => {
    _connectionState = state
  },

  /**
   * @access private
   * @function _resetState
   * @description Reset _connectionState value.
   */
  _resetState = () => {
    _setState(null)
  },

  /**
   * @access private
   * @function _getFetchTimeout
   * @description Retrieves fetchTimeout value.
   */
  _getFetchTimeout = () => {
    return _fetchTimeout
  },

  /**
   * @access private
   * @function _getIntervalTime
   * @description Retrieves fetchTimeout value.
   */
  _getIntervalTime = () => {
    return _intervalTime
  }

/**
 * @access private
 * @description Contains the main logic part of the connection checker library.
 * @class Checker
 */
class Checker {
  /**
   * @access private
   * @description Creates an instance of Checker.
   * @constructs
   * @memberof Checker
   */
  constructor () {
    /**
     * @access private
     * @description Represents the network state stored, it can be 'CONNECTED', 'DISCONNECTED' or null.
     * @property {ConnectionState|NULL}
     * @memberof Checker
    */
    this.networkState = null
    /**
     * @access private
     * @description Stores the generated interval for checker.
     * @property {number|NULL}
     * @memberof Checker
    */
    this.checkerInterval = null
    /**
     * @access private
     * @description Stores the request timeout time.
     * @property {number|NULL}
     * @memberof Checker
    */
    this.fetchTimeout = _getFetchTimeout()
      ? _getFetchTimeout()
      : REQUEST_TIMEOUT_TIME
    /**
     * @access private
     * @description Stores the interval time to launch fetchs.
     * @property {number|NULL}
     * @memberof Checker
    */
    this.intervalTime = _getIntervalTime()
      ? _getIntervalTime()
      : REQUEST_INTERVAL_TIME
  }

  /**
   * @access private
   * @function _checkNetwork
   * @description Executes ON_NETWORK_CHECKING event dispatcher, generates a Promise
   * which resolves or rejects depending on the resolution of fetch requesting a remote server.
   * @returns {Promise}
   * @memberof Checker
   */
  _checkNetwork () {
    this._dispatchNetworkChecking()
    return new Promise((resolve, reject) => {
      const fetchUrl = REMOTE_RESOURCE[0].url,
        fetchMethod = REMOTE_RESOURCE[0].method,
        noCache = btoa(Date.now())
      fetch(`${fetchUrl}/?nc=${noCache}`, {
        method: fetchMethod,
        mode: 'cors',
        timeout: this.fetchTimeout
      }).then((response) => {
        response.ok
          ? resolve(this._evaluateNetwork(ConnectionState.CONNECTED))
          : reject(this._evaluateNetwork(ConnectionState.DISCONNECTED))
      }).catch((e) => {
        reject(this._evaluateNetwork(ConnectionState.DISCONNECTED))
      })
    })
  }

  /**
   * @access private
   * @function _getNetworkState
   * @description Retrieves networkState value.
   * @returns {ConnectionState|NULL}
   * @memberof Checker
   */
  _getNetworkState () {
    return this.networkState
  }

  /**
   * @access private
   * @function _setNetworkState
   * @description Assigns state value to networkState.
   * @param {ConnectionState|NULL} state
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
   * @param {ConnectionState|NULL} state
   * @returns {boolean}
   * @memberof Checker
   */
  _hasNetworkChanged (state) {
    return this._getNetworkState() !== state
  }

  /**
   * @access private
   * @function _evaluateNetwork
   * @description Evaluates state to execute the ON_NETWORK_CHANGED event dispatcher if conditions are valid.
   * @param {ConnectionState|NULL} state
   * @memberof Checker
   */
  _evaluateNetwork (state) {
    this._hasNetworkChanged(state) && this._dispatchNetworkChanged(state)
  }

  /**
   * @access private
   * @function _dispatchNetworkChecking
   * @description Method that emits an event ON_NETWORK_CHECKING.
   * @fires ON_NETWORK_CHECKING
   * @memberof Checker
   */
  _dispatchNetworkChecking () {
    window.dispatchEvent(onNetworkChecking())
  }

  /**
   * @access private
   * @function _dispatchNetworkChanged
   * @description Emits an ON_NETWORK_CHANGED event with states changed 'from' and 'to', then validates
   * state to execute dispatchers of ON_NETWORK_CONNECTED or ON_NETWORK_DISCONNECTED events.
   * @fires ON_NETWORK_CHANGED
   * @param {ConnectionState|NULL} state
   * @memberof Checker
   */
  _dispatchNetworkChanged (state) {
    window.dispatchEvent(onNetworkChanged({ from: this._getNetworkState(), to: state }))
    state === ConnectionState.CONNECTED ? this._dispatchNetworkConnected() : this._dispatchNetworkDisconnected()
  }

  /**
   * @access private
   * @function _dispatchNetworkConnected
   * @description Emits an ON_NETWORK_CONNECTED event.
   * @fires ON_NETWORK_CONNECTED
   * @memberof Checker
   */
  _dispatchNetworkConnected () {
    this._setNetworkState(ConnectionState.CONNECTED)
    _setState(this._getNetworkState())
    window.dispatchEvent(onNetworkConnected())
  }

  /**
   * @access private
   * @function _dispatchNetworkDisconnected
   * @description Emits an ON_NETWORK_DISCONNECTED event.
   * @fires ON_NETWORK_DISCONNECTED
   * @memberof Checker
   */
  _dispatchNetworkDisconnected () {
    this._setNetworkState(ConnectionState.DISCONNECTED)
    _setState(this._getNetworkState())
    window.dispatchEvent(onNetworkDisconnected())
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
   * @access private
   * @function _startConnectionChecker
   * @description Starts the periodical execution of network validations.
   * @memberof Checker
   */
  _startConnectionChecker () {
    if (!this._isCheckerActive()) {
      this.checkerInterval = setInterval(() => {
        this._checkNetwork()
      }, this.intervalTime)
    }
  }

  /**
   * @access private
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
   * @access private
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
 * @function getConnectionState
 * @description Retrieves the stored network state.
 * @returns {ConnectionState|NULL}
 */
const getConnectionState = () => {
    return _getState()
  },

  /**
   * @access public
   * @function changeTimeout
   * @description Changes request timeout time of fetchs.
   * @returns {numbr|NULL}
   */
  changeTimeout = (timeoutTime = null) => {
    _fetchTimeout = timeoutTime
  },

  /**
   * @access public
   * @function changeInterval
   * @description  Changes ineterval time to launch network checks.
   * @returns {number|NULL}
   */
  changeInterval = (intervalTime = null) => {
    _intervalTime = intervalTime
  },

  /**
   * @access public
   * @function isCheckerActive
   * @description Checks if exist an instance of Checker class.
   * @returns {boolean}
   */
  isCheckerActive = () => {
    return !!_checkerInstance
  },

  /**
   * @access public
   * @function startChecker
   * @description Generates an instance of a Checker which keeps executing network validations.
   */
  startChecker = () => {
    if (!isCheckerActive()) {
      _resetState()
      _checkerInstance = new Checker()
      _checkerInstance._startConnectionChecker()
    }
  },

  /**
   * @access public
   * @function stopChecker
   * @description Stops the execution of network validations and destroys active instance of Checker.
   */
  stopChecker = () => {
    if (isCheckerActive()) {
      _checkerInstance._stopConnectionChecker()
      _checkerInstance = null
    }
  },

  /**
   * @access public
   * @function checkOnDemand
   * @description Creates instance of Checker, execute a network validation once, and destroys the created instance.
   */
  checkOnDemand = () => {
    let instance = new Checker()
    instance._checkConnectionOnDemand()
      .finally(() => {
        instance = null
      })
  }

export {
  getConnectionState,
  changeTimeout,
  changeInterval,
  isCheckerActive,
  startChecker,
  stopChecker,
  checkOnDemand
}
