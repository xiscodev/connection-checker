/**
 * @access public
 * @description Contains connection events
 * @constant {Object}
 */
const ConnectionEvent = {
  /**
   * @access public
   * @description Checking network event name.
   * @constant {ConnectionEvent}
   */
  ON_NETWORK_CHECKING: 'onNetworkChecking',
  /**
   * @access public
   * @description Changed network event name.
   * @constant {ConnectionEvent}
   */
  ON_NETWORK_CHANGED: 'onNetworkChanged',
  /**
   * @access public
   * @description Connected network event name.
   * @constant {ConnectionEvent}
   */
  ON_NETWORK_CONNECTED: 'onNetworkConnected',
  /**
   * @access public
   * @description Disconnected network event name.
   * @constant {ConnectionEvent}
   */
  ON_NETWORK_DISCONNECTED: 'onNetworkDisconnected'
}

export default ConnectionEvent
