var types = require("./types");

module.exports = function(proto) {
    for (var type in types.ENDIAN_TYPE) {
        var length = types.ENDIAN_TYPE[type];

        var ed = "BE";
        var fnName = `write${type}${ed}`;
        proto[fnName] = createWriteFn(fnName, length);
        var fnName = `read${type}${ed}`;
        proto[fnName] = createReadFn(fnName, length);

        var ed = "LE";
        var fnName = `write${type}${ed}`;
        proto[fnName] = createWriteFn(fnName, length);
        var fnName = `read${type}${ed}`;
        proto[fnName] = createReadFn(fnName, length);

        var fnName = `write${type}`;
        proto[fnName] = createShortFn(fnName, length);
        var fnName = `read${type}`;
        proto[fnName] = createShortFn(fnName, length);
    }
    for (var type in types.NO_ENDIAN_TYPE) {
        var length = types.NO_ENDIAN_TYPE[type];

        var fnName = `write${type}`;
        proto[fnName] = createWriteFn(fnName, length);
        var fnName = `read${type}`;
        proto[fnName] = createReadFn(fnName, length);
    }
}

function createWriteFn(fnName, length) {
    return function(value) {
        if (this._writePos + length > this._capacity) {
            throw new Error("Write Out Of Range");
        }
        this._buffer[fnName](value, this._writePos);
        this._writePos += length;
        return this;
    }
}

function createReadFn(fnName, length) {
    return function() {
        if (this._readPos + length > this._writePos) {
            throw new Error("Read Out Of Range");
        }
        var ret = this._buffer[fnName](this._readPos);
        this._readPos += length;
        return ret;
    }
}

function createShortFn(fnName) {
    return function() {
        var realFnName = `${fnName}${this._endian}`;
        return this[realFnName].apply(this, arguments);
    }
}
