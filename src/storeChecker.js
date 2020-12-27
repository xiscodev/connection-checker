import { INTERNET_REMOTE_RESOURCE, REQUEST_TIMEOUT_TIME, REQUEST_INTERVAL_TIME } from 'Constants/Defaults'

/**
 * @access private
 * @description Stores the connection state
 * @type {ConnectionState|NULL}
 */
let _connectionState = null,

  /**
   * @access private
   * @description Stores the checker instance
   * @type {ConnectionChecker|NULL}
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
   * @description Interval time to launch fetch requests set by user
   * @type {number|NULL}
   */
  _intervalTime = null,

  /**
   * @access private
   * @description Internet remote resource to fetch set by user
   * @type {Object|Array|NULL}
   */
  _internetResource = null

/**
 * @access private
 * @description Default checker interval name
 * @type {string}
 */
const CHECKER_INTERVAL = 'checker_interval',

  /**
   * @access public
   * @function getCheckerInstance
   * @description Retrieves the stored ConnectionChecker instance.
   * @returns {ConnectionChecker|NULL}
   */
  getCheckerInstance = () => {
    return _checkerInstance
  },

  /**
   * @access public
   * @function getConnectionState
   * @description Retrieves the stored network state.
   * @returns {ConnectionState|NULL}
   */
  getConnectionState = () => {
    return _connectionState
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
   * @function getFetchTimeout
   * @description Retrieves _fetchTimeout value.
   * @returns {number}
   */
  getFetchTimeout = () => {
    return _fetchTimeout || REQUEST_TIMEOUT_TIME
  },

  /**
   * @access public
   * @function getIntervalTime
   * @description Retrieves _intervalTime value.
   * @returns {number}
   */
  getIntervalTime = () => {
    return _intervalTime || REQUEST_INTERVAL_TIME
  },

  /**
   * @access public
   * @function getInternetResource
   * @description Retrieves user defined internet remote resource value.
   * @returns {Object|Array}
   */
  getInternetResource = () => {
    return _internetResource || INTERNET_REMOTE_RESOURCE
  },

  /**
   * @access public
   * @function setCheckerInstance
   * @description Set _checkerInstance value.
   * @param {ConnectionChecker|NULL} instance
   */
  setCheckerInstance = (instance) => {
    _checkerInstance = instance
  },

  /**
   * @access public
   * @function setConnectionState
   * @description Set _connectionState value.
   * @param {ConnectionState|NULL} state
   */
  setConnectionState = (state) => {
    _connectionState = state
  },

  /**
   * @access public
   * @function setFetchTimeout
   * @description Changes request timeout time of fetchs.
   * @param {number} timeoutTime
   */
  setFetchTimeout = (fetchTimeout = REQUEST_TIMEOUT_TIME) => {
    _fetchTimeout = fetchTimeout
  },

  /**
   * @access public
   * @function setIntervalTime
   * @description  Changes interval time to launch network checks.
   * @param {number} intervalTime
   */
  setIntervalTime = (intervalTime = REQUEST_INTERVAL_TIME) => {
    _intervalTime = intervalTime
  },

  /**
   * @access public
   * @function setInternetResource
   * @description  Changes the use of default INTERNET_REMOTE_RESOURCE for user provided internet resource.
   * @param {Object|Array} internetResource
   * @example <caption>Single internet resource case</caption>
   * singleResource = {url: 'http://fakeResourceZero.com', method: 'POST'}
   * setInternetResource(singleResource)
   * @example <caption>Multiple internet resource case</caption>
   * multipleResource = [
   *   {url: 'http://fakeResourceOne.com', method: 'GET'}
   *   {url: 'https://fakeResourceTwo.com', method: 'HEAD'}
   * ]
   * setInternetResource(multipleResource)
   */
  setInternetResource = (internetResource = INTERNET_REMOTE_RESOURCE) => {
    _internetResource = internetResource
  }

export {
  CHECKER_INTERVAL,
  getCheckerInstance,
  getConnectionState,
  isCheckerActive,
  getFetchTimeout,
  getIntervalTime,
  getInternetResource,
  setCheckerInstance,
  setConnectionState,
  setFetchTimeout,
  setIntervalTime,
  setInternetResource
}
