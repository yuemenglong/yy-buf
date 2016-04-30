var types = require("./types");
var StreamBuffer = require("./stream-buffer");

module.exports = function(proto) {
    for (var type in types.ENDIAN_TYPE) {
        var length = types.ENDIAN_TYPE[type];
        var fnName = `write${type}`;
        proto[fnName] = createWriteFn(fnName, length);
        var fnName = `read${type}`;
        proto[fnName] = createReadFn(fnName, length);
    }
    for (var type in types.NO_ENDIAN_TYPE) {
        var length = types.NO_ENDIAN_TYPE[type];
        var fnName = `write${type}`;
        proto[fnName] = createWriteFn(fnName, length);
        var fnName = `read${type}`;
        proto[fnName] = createReadFn(fnName, length);
    }
}

function createReadFn(fnName, length) {
    return function() {
        if (this._readBuffer.length() >= length) {
            return this._readBuffer[fnName]();
        }
        this.purge();
        if (this._readBuffer.length() >= length) {
            return this._readBuffer[fnName]();
        }
    }
}

function createWriteFn(fnName, length) {
    return function(value) {
        if (this._writeBuffer.remain() < length) {
            this._cache.push(this._writeBuffer.buffer());
            this._writeBuffer = new StreamBuffer();
        }
        this._writeBuffer[fnName](value);
        return this;
    }
}
