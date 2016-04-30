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
    proto.readUntil = readUntil;
    proto.readLine = readLine;
    proto.writeLine = writeLine;
    proto.readString = readString;
    proto.writeString = writeString;
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


function readUntil(sep) {
    if (typeof sep === "string") {
        sep = new Buffer(sep);
    } else if (typeof sep === "number") {
        var b = new Buffer(1);
        b.writeInt8(sep);
        sep = b;
    } else if (Array.isArray(sep)) {
        var b = new Buffer(sep.length);
        for (var i of sep) {
            b.writeInt8(i);
        }
        sep = b;
    }
    var buffer = this.buffer();
    var pos = buffer.indexOf(sep);
    if (pos < 0) {
        return;
    }
    var ret = this._readBuffer.read(pos);
    this._readBuffer.skip(sep.length);
    return ret;
}

function readLine() {
    return this.readUntil("\n");
}

function writeLine(str) {
    return this.write(str).write("\n");
}

function readString() {
    return this.readUntil(0);
}

function writeString(str) {
    return this.write(str).writeInt8(0);
}
