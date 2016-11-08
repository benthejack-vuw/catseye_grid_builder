export default class QDGLBuffer{
	private _gl:WebGLRenderingContext;

	private _location:number;
	private _buffer:WebGLBuffer;

	private _dataSize:number;

	constructor(name:string, dataSize:number, gl:WebGLRenderingContext, program:WebGLProgram){
		this._gl = gl;
		this._dataSize = dataSize;
		this._buffer = this._gl.createBuffer();
		this._location = this._gl.getAttribLocation(program, name);
		console.log(this._location);
	}

	public send(){
	  this._gl.enableVertexAttribArray(this._location);

      var type = this._gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0;        // start at the beginning of the buffer
      this._gl.vertexAttribPointer(this._location, this._dataSize, type, normalize, stride, offset);
	}

	private set(data:Array<number>) {
    	this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffer);
    	this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(data), this._gl.STATIC_DRAW);
  	}

  	public destroy(){
  		this._gl.deleteBuffer(this._buffer);
  	}
}