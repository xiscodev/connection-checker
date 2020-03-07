import ConnectionState from 'Constants/States'
import ConnectionEvent from 'Constants/Events'
import { getConnectionState, isCheckerActive, startChecker, stopChecker, checkOnDemand } from 'Checker'

exports.ConnectionState = ConnectionState
exports.ConnectionEvent = ConnectionEvent
exports.getConnectionState = getConnectionState
exports.isCheckerActive = isCheckerActive
exports.startChecker = startChecker
exports.stopChecker = stopChecker
exports.checkOnDemand = checkOnDemand
