/**
 * @description Collection of remote server urls with method to request resource.
 * @enum {Object}
 */
const REMOTE_RESOURCE = [
    { url: 'https://google.com', method: 'HEAD' }, // USA
    { url: 'https://yandex.ru', method: 'HEAD' }, // Russia
    { url: 'https://baidu.com', method: 'HEAD' } // China
  ],
  /**
   * @description Collection of remote server urls with method to request resource.
   * @constant {number}
   */
  REQUEST_TIMEOUT = 2000

export {
  REMOTE_RESOURCE,
  REQUEST_TIMEOUT
}
