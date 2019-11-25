class DefaultHandler {
  async handle() {
    throw 'Connection not ready yet';
  }
}

// TODO: console.error and all await errors maybe could be logged in remote filesystem widget?
class Connection {

  /*** @type {?string}*/
  sdp = null;
  /*** @type {boolean}*/
  connected = false;
  /*** @type {Object}*/
  handler = new DefaultHandler();

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

    // TODO: error handling
    // TODO: support closing
    this._peer.on('error', err => console.error('error ' + err));
    this._peer.on('signal', data => this.sdp = JSON.stringify(data));
    this._peer.on('connect', () => this.connected = true);
    this._peer.on('data', data => this._handleData(data));
  }

  connect(sdp) {
    if (this.connected) {
      throw 'Connection already established';
    }
    this._peer.signal(JSON.parse(sdp));
  }

  _handleData(data) {
    const json = JSON.parse(data);
    if (json.t === 'rs') {
      this._handleResponse(json);
    } else if (json.t === 'rq') {
      this._handleRequest(json);
    } else {
      console.error('Unsupported request type');
    }
  }

  _handleResponse(response) {
    const requestId = response.rid;
    const promise = this._requests[requestId];
    delete this._requests[requestId];
    if (!promise) {
      console.error('Got response to unknown request: ' + requestId);
      return;
    }

    if (response.e) {
      promise.reject(response.e);
    } else {
      promise.resolve(response.r);
    }
  }

  _handleRequest(request) {
    const requestId = request.rid;
    this.handler.handle(request.r).then(response => this._sendJson({
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

  /**
   * @param {Object} request
   * @returns {Promise<Object>}
   */
  sendRequest(request) {
    return new Promise((resolve, reject) => {
      const requestId = uuid4();
      this._requests[requestId] = {
        resolve: resolve,
        reject: reject
      };
      this._sendJson({
        t: 'rq',
        rid: requestId,
        r: request
      })
      // TODO: reject after timeout?
    });
  }
}