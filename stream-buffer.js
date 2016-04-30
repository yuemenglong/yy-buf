var streamBufferProtoFn = require("./stream-buffer-proto-fn");
var types = require("./types");

module.exports = StreamBuffer;

StreamBuffer.setEndian = function(endian) {
    types.ENDIAN = endian;
}

function StreamBuffer(arg) {
    if (arg instanceof Buffer) {
        var buffer = arg;
        this._capacity = buffer.length;
        this._readPos = 0;
        this._writePos = buffer.length;
        this._buffer = buffer;
    } else if (typeof arg === "string") {
        var buffer = new Buffer(arg);
        this._capacity = buffer.length;
        this._readPos = 0;
        this._writePos = buffer.length;
        this._buffer = buffer;
    } else {
        var capacity = arg;
        this._capacity = capacity || 128;
        this._readPos = 0;
        this._writePos = 0;
        this._buffer = new Buffer(this._capacity);
    }
}

StreamBuffer.prototype.length = function() {
    return this._writePos - this._readPos;
}

StreamBuffer.prototype.remain = function() {
    return this._capacity - this._writePos;
}

StreamBuffer.prototype.buffer = function() {
    return this._buffer.slice(this._readPos, this._writePos);
}

StreamBuffer.prototype.read = function(n) {
    n = n === undefined ? 1 : n;
    if (this._readPos + n > this._writePos) {
        throw new Error("Read Out Of Range");
    }
    var ret = this._buffer.slice(this._readPos, this._readPos + n);
    this._readPos += n;
    return ret;
}

StreamBuffer.prototype.skip = function(n) {
    if (this._readPos + n > this._writePos) {
        throw new Error("Skip Out Of Range");
    }
    this._readPos += n;
    return this;
}

StreamBuffer.prototype.write = function(buf) {
    if (this._writePos + buf.length > this._capacity) {
        throw new Error("Write Out Of Range");
    }
    this._buffer.write(buf, this._writePos);
    this._writePos += buf.length;
    return this;
}

StreamBuffer.prototype.clear = function() {
    this._readPos = this._writePos = 0;
    return this;
}

StreamBuffer.prototype.capacity = function() {
    return this._capacity;
}

streamBufferProtoFn(StreamBuffer.prototype);
