import ConnectionState from 'Constants/States'
import ConnectionEvent from 'Constants/Events'
import { getConnectionState, changeTimeout, changeInterval, changeInternetResource, isCheckerActive, startChecker, stopChecker, checkOnDemand } from 'Checker'

exports.ConnectionState = ConnectionState
exports.ConnectionEvent = ConnectionEvent
exports.getConnectionState = getConnectionState
exports.changeTimeout = changeTimeout
exports.changeInterval = changeInterval
exports.changeInternetResource = changeInternetResource
exports.isCheckerActive = isCheckerActive
exports.startChecker = startChecker
exports.stopChecker = stopChecker
exports.checkOnDemand = checkOnDemand
