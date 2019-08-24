import {Point} from "bj-utils"
import {QDShaderCompiler} from "./qdGLShaderCompiler"
import {QDOrthoCamera} from "./qdOrthoCamera"
import {QDGLBuffer} from "./qdGLBuffer"
import {QDGLTexture} from "./qdGLTexture"

export class QDOrthoGLCanvas{

	private _size:Point;
	private _canvas:HTMLCanvasElement;

	private _gl:WebGLRenderingContext;
	private _shaderProgram:WebGLProgram;

	private _camera:QDOrthoCamera;
	private _cameraMatrixName:string;
	private _buffers:any;
	private _textures:any;

	constructor(size:Point, vertexShader:string, fragmentShader:string, cameraMatrixName:string){

		this._buffers = {};
		this._textures = {};

		this._canvas = document.createElement("canvas");

		this._gl = this._canvas.getContext("webgl") as WebGLRenderingContext;
	    if (!this._gl) {
	      console.log("NO WEBGL!");
	    }

	    this._shaderProgram = QDShaderCompiler.createProgram(this._gl, vertexShader, fragmentShader);

	    this._gl.useProgram(this._shaderProgram);

	    this.setView(size);

	    this._cameraMatrixName = cameraMatrixName;
	    this._camera = new QDOrthoCamera(new Point(0,0), new Point(1, 1), cameraMatrixName, this._gl, this._shaderProgram);
	    this._camera.update();

	}

	public get canvas(){
		return this._canvas;
	}

	public get glContext(){
		return this._gl;
	}

	public setbuffer(name:string, data:Array<number>, dataSize:number){
		if(!this._buffers[name]){
			this._buffers[name] = new QDGLBuffer(name, dataSize, this._gl, this._shaderProgram);
		}
		this._buffers[name].set(data);
	}

	public setTexture(name:string, image:HTMLImageElement){
		if(!this._textures[name]){
			var unit = Object.keys(this._textures).length;
			this._textures[name] = new QDGLTexture(name, this._gl, this._shaderProgram, unit);
		}
		this._textures[name].set(image);
	}

	public setView(size:Point, boundingBox?:Point){
		this._size = size;
		this._canvas.width = this._size.x;
		this._canvas.height = this._size.y;
	    this._gl.viewport(0, 0, this._gl.drawingBufferWidth, this._gl.drawingBufferHeight);


	    if(boundingBox === undefined)
	   		this._camera = new QDOrthoCamera(new Point(0,0), new Point(1, size.y/size.x), this._cameraMatrixName, this._gl, this._shaderProgram);
	   	else
	   		this._camera = new QDOrthoCamera(new Point(0,0), new Point(boundingBox.x, boundingBox.y), this._cameraMatrixName, this._gl, this._shaderProgram);

	    this._camera.update();

	}

	public render(mode:number, dataSize:number){
		this._gl.drawArrays(mode, 0, dataSize);
	}

	public destroy(){

		var destroyObj = (obj:any)=>{
			var keys = Object.keys(obj);
			for (var i = 0; i < keys.length; ++i) {
				obj[keys[i]].destroy();
			}
		}

		destroyObj(this._buffers);
		destroyObj(this._textures);
	}

}
