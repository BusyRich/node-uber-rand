var vows = require('vows'),
    assert = require('assert');
    uberand = require(__dirname + '/lib/uberand');

vows.describe('Uberand').addBatch({
  'uberand': {
    topic: function() {
      uberand.hex(1, this.callback);
    },
    'First call for a number': {
      topic: uberand,
      'should fill the cache': function() {
        assert.isNotZero(uberand.cache.length);
      },
      'and empty the queue': function() {
        assert.isZero(uberand.queue.length);
      },
      'Number retrieval': {
        topic: uberand,
        'hexes': {
          topic: function() {
            uberand.hex(2, this.callback) 
          },
          'returns a hexadecimal value of length n': function (hex) {
            assert.lengthOf(hex + '', 4);
          }
        },
        'ints': {
          topic: function() {
            uberand.int(8, this.callback);
          },
          'returns an 8bit integer': function (inty) {
            assert.strictEqual(inty >= 0, true);
            assert.strictEqual(inty <= 255, true);
          }
        },
        'percent': {
          topic: function() {
            uberand.percent(this.callback);
          },
          'returns a value between 0 and 1': function (cent) {
            assert.strictEqual(cent >= 0, true);
            assert.strictEqual(cent <= 1, true);
          }
        }
      }
    }
  }
}).run();