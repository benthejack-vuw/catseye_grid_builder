import * as glMatrix from "gl-matrix"

export class QDOrthoCamera{

	_glCtx    = undefined;
	_location = -1;

	_eye =    [0, 0, 1];
	_target = [0, 0, 0];
	_up =     [0, 1, 0];

	_cameraMatrix         = undefined;
	_projectionMatrix     = undefined;
	_viewMatrix		      = undefined;
	_viewProjectionMatrix = undefined;

	constructor(topLeft, bottomRight, uniformName, glCtx, glProgram){

		this._projectionMatrix = glMatrix.mat4.create();
		this._cameraMatrix = glMatrix.mat4.create();
		this._viewMatrix = glMatrix.mat4.create();
		this._viewProjectionMatrix = glMatrix.mat4.create();

	    this._glCtx = glCtx;
	    this._location = this._glCtx.getUniformLocation(glProgram, uniformName);

	    glMatrix.mat4.ortho(this._projectionMatrix, topLeft.x, bottomRight.x, bottomRight.y, topLeft.y, -1, 1);

	    this.update();
	}

	set eye(pos){
		this._eye = pos;
		this.update();
	}

	set target(pos){
		this._target = pos;
		this.update();
	}

	set up(upVector){
		this._up = upVector;
		this.update();
	}

	update(){
	    // Compute the camera's matrix using look at.
	    glMatrix.mat4.lookAt(this._cameraMatrix, this._eye, this._target, this._up);

	    // Make a view matrix from the camera matrix.
	    glMatrix.mat4.invert(this._viewMatrix, this._cameraMatrix);
	    glMatrix.mat4.multiply(this._viewProjectionMatrix, this._projectionMatrix, this._viewMatrix);

	    // Set the matrix.
	    this._glCtx.uniformMatrix4fv(this._location, false, this._viewProjectionMatrix);
	}

}
