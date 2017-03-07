export class QDGLTexture {
    constructor(name, gl, program, textureUnit) {
        this._gl = gl;
        this._location = this._gl.getUniformLocation(program, name);
        this._texture = this._gl.createTexture();
        this._textureUnit = textureUnit === undefined ? 0 : textureUnit;
        console.log(this._location);
        this._gl.uniform1i(this._location, this._textureUnit);
    }
    set(image) {
        this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
        this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image);
    }
    destroy() {
        this._gl.deleteTexture(this._texture);
    }
}
//# sourceMappingURL=qdGLTexture.js.map