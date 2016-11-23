/// <reference path="../../../typings/index.d.ts"/>
import * as glMatrix from "gl-matrix"
import Point from "../geometry/Point"

export default class QDOrthoCamera{
	
	private _gl:WebGLRenderingContext;

	private _eye:Array<number>;
	private _target:Array<number>;
	private _up:Array<number>;

	private _pMatrix:glMatrix.mat4;
	private _cameraMatrix:glMatrix.mat4;
	private _viewMatrix:glMatrix.mat4;
	private _viewProjectionMatrix:glMatrix.mat4;

	private _location:WebGLUniformLocation;

	constructor(topLeft:Point, bottomRight:Point, name:string, gl:WebGLRenderingContext, program:WebGLProgram){
	    
		this._pMatrix = glMatrix.mat4.create();
		this._cameraMatrix = glMatrix.mat4.create();
		this._viewMatrix = glMatrix.mat4.create();
		this._viewProjectionMatrix = glMatrix.mat4.create();

	    this._gl = gl;
	    this._location = this._gl.getUniformLocation(program, name);

	    glMatrix.mat4.ortho(this._pMatrix, topLeft.x, bottomRight.x, bottomRight.y, topLeft.y, -1, 1);

	    this.eye = [0, 0, 1];
	    this.up = [0, 1, 0];
	    this.target = [0, 0, 0];
	    this.update();

	}

	public set eye(pos:Array<number>){
		this._eye = pos;
	}

	public set target(pos:Array<number>){
		this._target = pos;
	}

	public set up(upVector:Array<number>){
		this._up = upVector;
	}

	public update(){
	    // Compute the camera's matrix using look at.
	    glMatrix.mat4.lookAt(this._cameraMatrix, this._eye, this._target, this._up);

	    // Make a view matrix from the camera matrix.
	    glMatrix.mat4.invert(this._viewMatrix, this._cameraMatrix);
	    glMatrix.mat4.multiply(this._viewProjectionMatrix, this._pMatrix, this._viewMatrix);

	    // Set the matrix.
	    this._gl.uniformMatrix4fv(this._location, false, this._viewProjectionMatrix);
	}

}