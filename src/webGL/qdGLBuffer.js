export class QDGLBuffer{
	
	_buffer    = undefined;
	_glContext = undefined;
	_location  = -1;;

	constructor(glContext, glProgram, uniformName){
		this._glContext = glContext;
		this._buffer = this._glContext.createBuffer();
		this._location = this._glContext.getAttribLocation(glProgram, uniformName);
	}

	set(data, dataSize) {
		this._glContext.enableVertexAttribArray(this._location);
    	this._glContext.bindBuffer(this._glContext.ARRAY_BUFFER, this._buffer);
    	this._glContext.bufferData(this._glContext.ARRAY_BUFFER, new Float32Array(data), this._glContext.STATIC_DRAW);
    	var type = this._glContext.FLOAT;   // the data is 32bit floats
		var normalize = false; 		 		// don't normalize the data
		var stride = 0;        		 		// 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        		 		// start at the beginning of the buffer
		this._glContext.vertexAttribPointer(this._location, dataSize, type, normalize, stride, offset);
  	}

  	destroy(){
  		this._glContext.deleteBuffer(this._buffer);
  	}
}
