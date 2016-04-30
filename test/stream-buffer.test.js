var should = require("should");

var StreamBuffer = require("../stream-buffer")

//length read write skip buffer clear remain
describe('StreamBuffer', function() {
    it('Basic Read/Write', function(done) {
        var buffer = new StreamBuffer(128);
        buffer.length().should.eql(0);
        buffer.write("asdf");
        buffer.length().should.eql(4);
        buffer.read(2).toString().should.eql("as");
        buffer.length().should.eql(2);
        buffer.write("qwe");
        buffer.remain().should.eql(121);
        buffer.read(1).toString().should.eql("d");
        buffer.skip(2).read(2).toString().should.eql("we");
        buffer.write("hello").write(" ").write("world");
        buffer.buffer().toString().should.eql("hello world");
        buffer.clear();
        buffer.length().should.eql(0);
        buffer.capacity().should.eql(128);
        done();
    });
    it('Use Exists Buf', function(done) {
        var buffer = new StreamBuffer("already");
        buffer.remain().should.eql(0);
        buffer.length().should.eql(7);
        buffer.skip(2).read(3).toString().should.eql("rea");
        buffer.capacity().should.eql(7);
        buffer.clear();
        buffer.remain().should.eql(7);
        done();
    });
    it('Reach Max Size', function(done) {
        var buffer = new StreamBuffer(5);
        buffer.write("asdf").remain().should.eql(1);
        try {
            buffer.write("asfd");
        } catch (err) {
            done();
        }
    });
    it('Short Fn', function(done) {
        var buffer = new StreamBuffer();
        buffer.writeInt8(100);
        var ret = buffer.readInt8();
        ret.should.eql(100);

        buffer.writeInt16(100);
        var ret = buffer.readInt16();
        ret.should.eql(100);

        buffer.writeInt32(100);
        var ret = buffer.readInt32();
        ret.should.eql(100);

        buffer.writeInt32(0x12345678);
        buffer.readInt16().should.eql(0x1234);
        buffer.readInt8().should.eql(0x56);
        buffer.readUInt8().should.eql(0x78);

        buffer.length().should.eql(0);
        done();
    });
    it('Short Fn LE', function(done) {
        StreamBuffer.setEndian("LE");
        var buffer = new StreamBuffer();
        
        buffer.writeInt8(100);
        var ret = buffer.readInt8();
        ret.should.eql(100);

        buffer.writeInt16(100);
        var ret = buffer.readInt16();
        ret.should.eql(100);

        buffer.writeInt32(100);
        var ret = buffer.readInt32();
        ret.should.eql(100);

        buffer.writeInt32(0x12345678);
        buffer.readInt16().should.eql(0x5678);
        buffer.readInt8().should.eql(0x34);
        buffer.readUInt8().should.eql(0x12);

        buffer.length().should.eql(0);

        StreamBuffer.setEndian("BE");
        done();
    });
});
