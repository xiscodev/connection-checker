/**
 * @description Collection of remote server urls with method to request resource.
 * @enum {Object}
 */
const REMOTE_RESOURCE = [
    { url: 'https://www.google.com', method: 'HEAD' }, // USA
    { url: 'https://yandex.ru', method: 'HEAD' }, // Russia
    { url: 'https://baidu.com', method: 'HEAD' } // China
  ],
  /**
   * @description Timeout value for fetch requests.
   * @constant {number}
   */
  REQUEST_TIMEOUT_TIME = 2000,
  /**
   * @description Interval time to run fetch requests.
   * @constant {number}
   */
  REQUEST_INTERVAL_TIME = 10000

export {
  REMOTE_RESOURCE,
  REQUEST_TIMEOUT_TIME,
  REQUEST_INTERVAL_TIME
}
