export class QDGLBuffer {
    constructor(name, dataSize, gl, program) {
        this._name = name;
        this._gl = gl;
        this._dataSize = dataSize;
        this._buffer = this._gl.createBuffer();
        this._location = this._gl.getAttribLocation(program, name);
    }
    set(data) {
        this._gl.enableVertexAttribArray(this._location);
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffer);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(data), this._gl.STATIC_DRAW);
        var type = this._gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        this._gl.vertexAttribPointer(this._location, this._dataSize, type, normalize, stride, offset);
    }
    destroy() {
        this._gl.deleteBuffer(this._buffer);
    }
}
//# sourceMappingURL=qdGLBuffer.js.map