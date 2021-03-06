var should = require("should");

var Buf = require("../buf")

describe('Buf', function() {
    it('Int32', function(done) {
        var buf = new Buf();
        buf.writeInt32(100);
        var ret = buf.readInt32();
        ret.should.eql(100);
        buf.length().should.eql(0);
        done();
    });
    it('Lots Of Int32', function(done) {
        var buf = new Buf();
        for (var i = 0; i < 10000; i++) {
            buf.writeInt32(i);
        }
        for (var i = 0; i < 10000; i++) {
            var ret = buf.readInt32();
            ret.should.eql(i);
        }
        done();
    });
    it('Lots Of Int32 Use Orig Buffer', function(done) {
        var buffer = new Buffer(100000);
        for (var i = 0; i < 10000; i++) {
            buffer.writeInt32BE(i, i * 4);
        }
        for (var i = 0; i < 10000; i++) {
            var ret = buffer.readInt32BE(i * 4);
            ret.should.eql(i);
        }
        done();
    });
    it('Alloc String', function(done) {
        var buf = new Buf();
        buf.write("asf");
        buf.write("1122");
        var ret = buf.read(2);
        ret.toString().should.eql("as");
        ret = buf.read(3);
        ret.toString().should.eql("f11");
        buf.length().should.eql(2);
        done();
    });
    it('Read Until', function(done) {
        var buf = new Buf();
        buf.write("asf");
        buf.write("11\n22");
        buf.readUntil("\n").toString().should.eql("asf11");
        buf.writeInt8(0);
        buf.readUntil(0).toString().should.eql("22");
        buf.length().should.eql(0);
        done();
    });
    it('Read/Write String', function(done) {
        var buf = new Buf();
        buf.writeString("hello");
        buf.writeString("world");
        buf.length().should.eql(12);
        buf.readString().toString().should.eql("hello");
        buf.readString().toString().should.eql("world");
        done();
    });
});
