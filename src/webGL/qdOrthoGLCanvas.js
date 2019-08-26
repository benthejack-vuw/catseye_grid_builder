import {Point} from "bj-utils"
import {QDShaderCompiler} from "./qdGLShaderCompiler"
import {QDOrthoCamera} from "./qdOrthoCamera"
import {QDGLBuffer} from "./qdGLBuffer"
import {QDGLTexture} from "./qdGLTexture"

export class QDOrthoGLCanvas{

	_buffers = {};
	_camera;
	_cameraMatrixUniformName;
	_canvas;
	_glCtx;
	_shaderProgram;
	_size;
	_textures = {};

	constructor(canvas, glContext, vertexShader, fragmentShader, cameraMatrixUniformName){
		this._canvas = canvas;
		this._glCtx = glContext;
	    this._shaderProgram = QDShaderCompiler.createProgram(this._glCtx, vertexShader, fragmentShader);
		this._glCtx.useProgram(this._shaderProgram);
		this._cameraMatrixUniformName = cameraMatrixUniformName;
	}

	get canvas(){
		return this._canvas;
	}

	get glContext(){
		return this._glCtx;
	}

	setbuffer(data, dataSize, uniformName){	
		if(!this._buffers[uniformName]){
			this._buffers[uniformName] = new QDGLBuffer(this._glCtx, this._shaderProgram, uniformName);
		}

		this._buffers[uniformName].set(data, dataSize);
	}

	setTexture(image, uniformName){
		if(!this._textures[uniformName]){
			var unit = Object.keys(this._textures).length;
			this._textures[uniformName] = new QDGLTexture(this._glCtx, this._shaderProgram, uniformName, unit);
		}
		this._textures[uniformName].set(image);
	}

	setView(viewPort, ModelView){
		this._canvas.width = viewPort.x;
		this._canvas.height = viewPort.y;

	    this._glCtx.viewport(0, 0, this._glCtx.drawingBufferWidth, this._glCtx.drawingBufferHeight);
		this._camera = new QDOrthoCamera({x:0, y:0}, {x:ModelView.x, y:ModelView.y}, this._cameraMatrixUniformName, this._glCtx, this._shaderProgram);
	    this._camera.update();
	}

	render(mode, dataSize){
		this._glCtx.drawArrays(mode, 0, dataSize);
	}

	destroy(){
		var destroyObj = (obj)=>{
			Object.keys(obj).forEach(
				(key) => { obj[key].destroy() }
			)
		}

		destroyObj(this._buffers);
		destroyObj(this._textures);
	}

}
