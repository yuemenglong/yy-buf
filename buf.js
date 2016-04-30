var types = require("./types");
var StreamBuffer = require("./stream-buffer");
var bufProtoFn = require("./buf-proto-fn");

Buf.ENDIAN_TYPE = types.ENDIAN_TYPE;
Buf.NO_ENDIAN_TYPE = types.NO_ENDIAN_TYPE;
module.exports = Buf;

function Buf(endian) {
    this._cache = [];
    this._readBuffer = new StreamBuffer(); //StreamBuffer
    this._writeBuffer = new StreamBuffer(); //StreamBuffer
}

Buf.prototype.write = function(buf) {
    if (buf instanceof Buffer) {
        this._cache.push(buf);
    } else if (typeof buf === "string") {
        this._cache.push(new Buffer(buf));
    } else {
        throw new Error("Only Can Write Buffer/String");
    }
}

Buf.prototype.read = function(n) {
    n = n === undefined ? 1 : n;
    if (this._readBuffer.length() >= n) {
        return this._readBuffer.read(n);
    }
    this.purge();
    if (this._readBuffer.length() >= n) {
        return this._readBuffer.read(n);
    }
    return;
}

Buf.prototype.readUntil = function(sep) {
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

Buf.prototype.purge = function() {
    if (!this._cache.length && !this._writeBuffer.length()) {
        return;
    }
    if (!this._cache.length && !this._readBuffer.length()) {
        var tmp = this._readBuffer;
        this._readBuffer = this._writeBuffer;
        this._writeBuffer = tmp;
        return;
    }
    if (this._readBuffer.length()) {
        this._cache.unshift(this._readBuffer.buffer());
        this._readBuffer = new StreamBuffer();
    }
    if (this._writeBuffer.length()) {
        this._cache.push(this._writeBuffer.buffer());
        this._writeBuffer = new StreamBuffer();
    }
    var buffer = Buffer.concat(this._cache);
    this._readBuffer = new StreamBuffer(buffer);
    if (this._writeBuffer.length()) {
        this._writeBuffer = new StreamBuffer();
    }
    this._cache = [];
}

Buf.prototype.clear = function() {
    this._readBuffer.clear();
    this._writeBuffer.clear();
    this._cache = [];
}

Buf.prototype.length = function() {
    this.purge();
    return this._readBuffer.length();
}

Buf.prototype.buffer = function() {
    this.purge();
    return this._readBuffer.buffer();
}

bufProtoFn(Buf.prototype);


if (require.main == module) {

}


// buf.write(string, buffer)
// buf.writeString()
// buf.readString()
