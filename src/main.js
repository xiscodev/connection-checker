import ConnectionState from 'Constants/States'
import ConnectionEvent from 'Constants/Events'
import { startChecker, stopChecker, checkOnDemand } from 'ConnectionChecker'
import { getCheckerInstance, getConnectionState, isCheckerActive, getFetchTimeout, getIntervalTime, getInternetResource, setCheckerInstance, setConnectionState, setFetchTimeout, setIntervalTime, setInternetResource } from 'storeChecker'
// FROM CONSTANTS
exports.ConnectionState = ConnectionState
exports.ConnectionEvent = ConnectionEvent
// FROM CHECKER
exports.startChecker = startChecker
exports.stopChecker = stopChecker
exports.checkOnDemand = checkOnDemand
// FROM STORE
exports.getCheckerInstance = getCheckerInstance
exports.getConnectionState = getConnectionState
exports.isCheckerActive = isCheckerActive
exports.getFetchTimeout = getFetchTimeout
exports.getIntervalTime = getIntervalTime
exports.getInternetResource = getInternetResource
exports.setCheckerInstance = setCheckerInstance
exports.setConnectionState = setConnectionState
exports.setFetchTimeout = setFetchTimeout
exports.setIntervalTime = setIntervalTime
exports.setInternetResource = setInternetResource
