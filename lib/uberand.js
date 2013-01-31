module.exports = {
  request: require('request'),
  _url: "https://150.203.48.55/API/jsonI.php?type=hex16&size=1&length=",

  /**
   * Keep a cache of hex octets.
   * This minimizes requests and allows
   * for faster processing.
   **/
  cache: [],
  cacheSize: 1000,

  /**
   * Simple queue used when things are busy getting new octets.
   **/ 
  queue: [],

  /**
   * Simple HTTP request to get more octets.
   **/
  _get: function(callback) {
    if(this.cacheSize > 1024) {
      this.cacheSize = 1024;
    }

    var url = this._url + this.cacheSize;

    this.request(url, function(err, res, body) {
      if (err) return callback(err, null);
      else if (res.statusCode !== 200) return callback(new Error(body), null);
      else return callback(null, JSON.parse(body).data);
    });
  },

  /**
   * Fills the cache and runs the queued items.
   **/
  _fill: function() {
    var uber = this;
    uber._get(function(err, octets) {
      uber.cache = uber.cache.concat(octets);
      uber._emptyQueue();
    });
  },

  /**
   * Queue a method call.
   **/
  _enqueue: function(fn, args) {
    this.queue.push({
      action: fn,
      args: args
    });
  },

  /**
   * Run all calls waiting in the queue.
   **/
  _emptyQueue: function() {
    for(var q = 0; q < this.queue.length; q++) {
      this[this.queue[q].action].apply(this, this.queue[q].args);
    }

    this.queue = [];
  },

  /**
   * Checks the cache to make sure their is enough
   * octets left for the call.
   **/
  _check: function(size, fn, args) {
    if(this.cache.length < size) {
      this._enqueue(fn, args);
      this._fill();
      return false;
    }

    return true;
  },

  /**
   * Gets a hex value.
   * @param size The number of octets in the hex value.
   **/
  hex: function(size, callback) {
    if(this._check(size, 'hex', arguments)) {
      callback(null, this.cache.splice(0, size).join(""));
    }
  },

  /**
   * Gets an integer value.
   * @param bits The size of integer, in bits.
   * Accepts 32, 16, and 8 bits.
   **/
  int: function(bits, callback) {
    if(bits !== 32 && bits !== 16 && bits !== 8) {
      callback('Invalid bit size.');
    }

    if(this._check(bits/8, 'int', arguments)) {
      this.hex(bits/8, function(err, hex) {
        if(err) {
          return callback(err);
        }

        callback(null, parseInt(hex, 16));
      });
    }
  },

  /**
   * Gets an decimal value between 0 and 1.
   **/
  percent: function(callback) {
    if(this._check(4, 'percent', arguments)) {
      var bits = 32;

      this.int(bits, function(err, num) {
        if(err) {
          return callback(err);
        }

        var max = Math.pow(2, bits);
        callback(null, (num / max).toFixed(2));
      });
    }
  }
};