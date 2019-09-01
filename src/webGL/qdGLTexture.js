export class QDGLTexture{

	_glCtx = undefined;
	_location = undefined;
	_texture = undefined;
	_textureUnit = undefined;
	_image = undefined;

	constructor(glCtx, program, uniformName, textureUnit){
		this._glCtx = glCtx;
		this._location = this._glCtx.getUniformLocation(program, uniformName);

		this._texture = this._glCtx.createTexture();
		this._textureUnit = textureUnit === undefined ? 0 : textureUnit;
	}

	set(image){
		if(image !== this._image){
			this._glCtx.bindTexture(this._glCtx.TEXTURE_2D, this._texture);
			this._glCtx.texParameteri(this._glCtx.TEXTURE_2D, this._glCtx.TEXTURE_MIN_FILTER, this._glCtx.LINEAR);
			this._glCtx.texParameteri(this._glCtx.TEXTURE_2D, this._glCtx.TEXTURE_WRAP_S, this._glCtx.CLAMP_TO_EDGE);
			this._glCtx.texParameteri(this._glCtx.TEXTURE_2D, this._glCtx.TEXTURE_WRAP_T, this._glCtx.CLAMP_TO_EDGE);
			this._glCtx.texImage2D(
				this._glCtx.TEXTURE_2D,
				0,
				this._glCtx.RGBA,
				this._glCtx.RGBA,
				this._glCtx.UNSIGNED_BYTE,
				image
			);
			this._image = image;
		}
    	// Tell the shader to use texture unit 0 for u_texture
	}

	destroy(){
		this._glCtx.deleteTexture(this._texture);
	}



}
