import ConnectionState from 'Constants/States'
import { onNetworkChecking, onNetworkChanged, onNetworkConnected, onNetworkDisconnected } from 'NetworkEventEmitter'
import { isObject, isArray, isNull, isString } from 'the-type-validator'
import { createInterval, destroyInterval, existInterval } from 'timer-creator'
import { getCheckerInstance, setCheckerInstance, setConnectionState, getFetchTimeout, getIntervalTime, isCheckerActive, getInternetResource, CHECKER_INTERVAL } from 'storeChecker'

/**
 * @access public
 * @description Contains the main logic part of the connection checker library.
 * @class ConnectionChecker
 */
class ConnectionChecker {
  /**
   * @access private
   * @description Creates an instance of ConnectionChecker.
   * @constructs
   * @memberof ConnectionChecker
   */
  constructor (fetchTimeout, intervalTime, internetResources) {
    /**
     * @access private
     * @description Represents the network state stored, it can be 'CONNECTED', 'DISCONNECTED' or null.
     * @property {ConnectionState|NULL}
     * @memberof ConnectionChecker
     */
    this.networkState = null
    /**
     * @access private
     * @description Stores the request timeout time.
     * @property {number|NULL}
     * @memberof ConnectionChecker
     */
    this.fetchTimeout = fetchTimeout
    /**
     * @access private
     * @description Stores the interval time to launch fetchs.
     * @property {number|NULL}
     * @memberof ConnectionChecker
     */
    this.intervalTime = intervalTime
    /**
     * @access private
     * @description Stores the user defined internet remote resource(s).
     * @property {Object|Array|NULL}
     * @memberof ConnectionChecker
     */
    this.internetResources = internetResources

    // bindings
    this._getNetworkState = this._getNetworkState.bind(this)
    this._setNetworkState = this._setNetworkState.bind(this)
    this._hasNetworkChanged = this._hasNetworkChanged.bind(this)
    this._evaluateNetwork = this._evaluateNetwork.bind(this)
    this._dispatchNetworkChecking = this._dispatchNetworkChecking.bind(this)
    this._dispatchNetworkChanged = this._dispatchNetworkChanged.bind(this)
    this._dispatchNetworkConnected = this._dispatchNetworkConnected.bind(this)
    this._dispatchNetworkDisconnected = this._dispatchNetworkDisconnected.bind(this)
    this._isCheckerActive = this._isCheckerActive.bind(this)
    this._startConnectionChecker = this._startConnectionChecker.bind(this)
    this._stopConnectionChecker = this._stopConnectionChecker.bind(this)
    this._checkConnectionOnDemand = this._checkConnectionOnDemand.bind(this)
    this._checkNetwork = this._checkNetwork.bind(this)
  }

  /**
   * @access private
   * @function _getNetworkState
   * @description Retrieves networkState value.
   * @returns {ConnectionState|NULL}
   * @memberof ConnectionChecker
   */
  _getNetworkState () {
    return this.networkState
  }

  /**
   * @access private
   * @function _setNetworkState
   * @description Assigns state value to networkState.
   * @param {ConnectionState|NULL} state
   * @memberof ConnectionChecker
   */
  _setNetworkState (state) {
    this.networkState = state
  }

  /**
   * @access private
   * @function _hasNetworkChanged
   * @description Validates if there has been a change on network state.
   * @param {ConnectionState|NULL} state
   * @returns {boolean}
   * @memberof ConnectionChecker
   */
  _hasNetworkChanged (state) {
    return this._getNetworkState() !== state
  }

  /**
   * @access private
   * @function _evaluateNetwork
   * @description Evaluates state to execute the ON_NETWORK_CHANGED event dispatcher if conditions are valid.
   * @param {ConnectionState|NULL} state
   * @memberof ConnectionChecker
   */
  _evaluateNetwork (state) {
    this._hasNetworkChanged(state) && this._dispatchNetworkChanged(state)
  }

  /**
   * @access private
   * @function _dispatchNetworkChecking
   * @description Method that emits an event ON_NETWORK_CHECKING.
   * @fires ON_NETWORK_CHECKING
   * @memberof ConnectionChecker
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
   * @memberof ConnectionChecker
   */
  _dispatchNetworkChanged (state) {
    window.dispatchEvent(onNetworkChanged({ from: this._getNetworkState(), to: state }))
    state === ConnectionState.CONNECTED
      ? this._dispatchNetworkConnected()
      : this._dispatchNetworkDisconnected()
  }

  /**
   * @access private
   * @function _dispatchNetworkConnected
   * @description Emits an ON_NETWORK_CONNECTED event.
   * @fires ON_NETWORK_CONNECTED
   * @memberof ConnectionChecker
   */
  _dispatchNetworkConnected () {
    this._setNetworkState(ConnectionState.CONNECTED)
    window.dispatchEvent(onNetworkConnected())
  }

  /**
   * @access private
   * @function _dispatchNetworkDisconnected
   * @description Emits an ON_NETWORK_DISCONNECTED event.
   * @fires ON_NETWORK_DISCONNECTED
   * @memberof ConnectionChecker
   */
  _dispatchNetworkDisconnected () {
    this._setNetworkState(ConnectionState.DISCONNECTED)
    window.dispatchEvent(onNetworkDisconnected())
  }

  /**
   * @access private
   * @function _isCheckerActive
   * @description Checks if there is an active checker.
   * @returns {boolean}
   * @memberof ConnectionChecker
   */
  _isCheckerActive () {
    return !!existInterval(CHECKER_INTERVAL)
  }

  /**
   * @access private
   * @function _startConnectionChecker
   * @description Starts the periodical execution of network validations.
   * @memberof ConnectionChecker
   */
  _startConnectionChecker () {
    if (!this._isCheckerActive()) {
      setConnectionState(null)
      createInterval(CHECKER_INTERVAL, this.intervalTime, this._checkNetwork)
    }
  }

  /**
   * @access private
   * @function _stopConnectionChecker
   * @description Stops any periodical execution of network validations and resets network state.
   * @memberof ConnectionChecker
   */
  _stopConnectionChecker () {
    if (this._isCheckerActive()) {
      setConnectionState(null)
      destroyInterval(CHECKER_INTERVAL)
    }
  }

  /**
   * @access private
   * @function _checkConnectionOnDemand
   * @description Executes _checkNetwork method and retrieves its Promise result once.
   * @returns {Promise}
   * @memberof ConnectionChecker
   */
  _checkConnectionOnDemand () {
    return this._checkNetwork()
  }

  /**
   * @access private
   * @function _checkNetwork
   * @description Executes ON_NETWORK_CHECKING event dispatcher, generates a Promise
   * which resolves or rejects depending on the resolution of fetch requesting a remote server.
   * @returns {Promise}
   * @memberof ConnectionChecker
   */
  _checkNetwork () {
    this._dispatchNetworkChecking()
    const noCache = btoa(Date.now()),
      networkRequests = []
    let allPromiseSettled = null,
      fetchData = null

    if (isObject(this.internetResources)) {
      fetchData = (this.internetResources.url !== undefined &&
          this.internetResources.method !== undefined)
        ? [this.internetResources]
        : null
    } else if (isArray(this.internetResources)) {
      fetchData = this.internetResources
    }

    if (isNull(fetchData) || isString(fetchData)) {
      console.error('Wrong user provided internet resource')
      this._evaluateNetwork(ConnectionState.DISCONNECTED)
    } else {
      for (let index = 0; index < fetchData.length; index++) {
        const fetchUrl = fetchData[index].url,
          fetchMethod = fetchData[index].method,
          fetchRequest = fetch(`${fetchUrl}/?nc=${noCache}`, {
            method: fetchMethod,
            mode: 'no-cors',
            timeout: this.fetchTimeout
          })
        networkRequests.push(fetchRequest)
      }

      allPromiseSettled = Promise.allSettled(networkRequests).then((results) => {
        let failedRequests = 0
        for (let index = 0; index < results.length; index++) {
          if (results[index].status === 'rejected') {
            failedRequests++
          }
        }

        const ALL_REQUESTS_FAILED = failedRequests === results.length,
          SOME_REQUESTS_FAILED = failedRequests > 0 && failedRequests < results.length

        if (ALL_REQUESTS_FAILED) {
          this._evaluateNetwork(ConnectionState.DISCONNECTED)
        } else if (SOME_REQUESTS_FAILED) {
          this._evaluateNetwork(ConnectionState.CONNECTED)
        } else {
          this._evaluateNetwork(ConnectionState.CONNECTED)
        }
      })
    }
    return allPromiseSettled
  }
}

/**
 * @access public
 * @function startChecker
 * @description Generates an instance of a ConnectionChecker which keeps executing network validations.
 */
const startChecker = () => {
    if (!isCheckerActive()) {
      const connectionChecker = new ConnectionChecker(getFetchTimeout(), getIntervalTime(), getInternetResource())
      connectionChecker._startConnectionChecker()
      setCheckerInstance(connectionChecker)
    }
  },

  /**
   * @access public
   * @function stopChecker
   * @description Stops the execution of network validations and destroys active instance of ConnectionChecker.
   */
  stopChecker = () => {
    if (isCheckerActive()) {
      const connectionChecker = getCheckerInstance()
      connectionChecker._stopConnectionChecker()
      setCheckerInstance(null)
    }
  },

  /**
   * @access public
   * @function checkOnDemand
   * @description Creates instance of ConnectionChecker, execute a network validation once, and destroys the created instance.
   */
  checkOnDemand = () => {
    setConnectionState(null)
    let instance = new ConnectionChecker(getFetchTimeout(), getIntervalTime(), getInternetResource())
    instance._checkConnectionOnDemand()
      .finally(() => {
        instance = null
      })
  }

export {
  startChecker,
  stopChecker,
  checkOnDemand
}
