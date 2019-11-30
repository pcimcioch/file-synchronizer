import {uuid4} from '../utils/crypto.js';

class DefaultRequestHandler {
  async handle() {
    throw 'Connection not ready yet';
  }
}

class DefaultErrorHandler {
  handle(message) {
    console.log(new Date(), message);
  }
}

export class Connection {

  /*** @type {?Object}*/
  sdp = null;
  /*** @type {string} One of: starting, signaled, connected, closed*/
  state = 'starting';
  /*** @type {Object}*/
  requestHandler = new DefaultRequestHandler();
  /** @type {Object} */
  errorHandler = new DefaultErrorHandler();

  /**
   * @type {SimplePeer}
   * @private
   */
  _peer = null;
  _requests = {};

  constructor(initiator) {
    this._peer = new SimplePeer({
      initiator: initiator,
      trickle: false
    });

    this._peer.on('error', err => this.errorHandler.handle('Peer error: ' + err));
    this._peer.on('signal', data => {
      this.sdp = data;
      this.state = 'signaled';
    });
    this._peer.on('connect', () => this.state = 'connected');
    this._peer.on('data', data => this._handleData(data));
    this._peer.on('close', () => this.state = 'closed');
  }

  /*** @param {Object} sdp*/
  connect(sdp) {
    if (this.state === 'connected') throw 'Connection already established';
    if (this.state === 'closed') throw 'Connection already closed';

    this._peer.signal(sdp);
  }

  _handleData(data) {
    const json = JSON.parse(data);
    if (json.t === 'rs') {
      this._handleResponse(json);
    } else if (json.t === 'rq') {
      this._handleRequest(json);
    } else {
      this.errorHandler.handle('Unsupported request type ' + json);
    }
  }

  _handleResponse(response) {
    const requestId = response.rid;
    const promise = this._requests[requestId];
    delete this._requests[requestId];
    if (!promise) {
      this.errorHandler.handle('Got response to unknown request: ' + requestId);
      return;
    }

    clearTimeout(promise.time);
    if (response.e) {
      promise.reject(response.e);
    } else {
      promise.resolve(response.r);
    }
  }

  _handleRequest(request) {
    const requestId = request.rid;
    this.requestHandler.handle(request.r).then(response => this._sendJson({
      t: 'rs',
      rid: requestId,
      r: response
    })).catch(error => this._sendJson({
      t: 'rs',
      rid: requestId,
      e: error,
    }));
  }

  _sendJson(obj) {
    this._peer.send(JSON.stringify(obj));
  }

  _timeout(requestId) {
    const promise = this._requests[requestId];
    delete this._requests[requestId];
    if (promise) {
      promise.reject('Timeout');
    }
  }

  /**
   * @param {Object} request
   * @param {number} [timeout=5000]
   * @returns {Promise<Object>}
   */
  sendRequest(request, timeout = 5000) {
    if (this.state === 'starting' || this.state === 'signaled') throw 'Connection not yet established';
    if (this.state === 'closed') throw 'Connection already closed';

    return new Promise((resolve, reject) => {
      const requestId = uuid4();
      const timeoutHandle = setTimeout(() => this._timeout(requestId), timeout);
      this._requests[requestId] = {
        resolve: resolve,
        reject: reject,
        timeout: timeoutHandle
      };
      this._sendJson({
        t: 'rq',
        rid: requestId,
        r: request
      })
    });
  }

  close() {
    if (this.state === 'closed') return;

    this._peer.destroy();
  }
}