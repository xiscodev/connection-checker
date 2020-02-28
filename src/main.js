import { CONNECTED, DISCONNECTED } from 'Constants/States'
import { ON_NETWORK_CHECKING, ON_NETWORK_CHANGED, ON_NETWORK_CONNECTED, ON_NETWORK_DISCONNECTED } from 'Constants/Events'
import { networkState, isCheckerActive, startConnectionChecker, stopConnectionChecker, checkConnectionOnDemand } from 'Checker'

exports.ConnectionState = {
  CONNECTED,
  DISCONNECTED
}
exports.ConnectionEvent = {
  ON_NETWORK_CHECKING,
  ON_NETWORK_CHANGED,
  ON_NETWORK_CONNECTED,
  ON_NETWORK_DISCONNECTED
}
exports.networkState = networkState
exports.isCheckerActive = isCheckerActive
exports.startConnectionChecker = startConnectionChecker
exports.stopConnectionChecker = stopConnectionChecker
exports.checkConnectionOnDemand = checkConnectionOnDemand
