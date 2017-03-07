import * as glMatrix from "gl-matrix";
export class QDOrthoCamera {
    constructor(topLeft, bottomRight, name, gl, program) {
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
    set eye(pos) {
        this._eye = pos;
    }
    set target(pos) {
        this._target = pos;
    }
    set up(upVector) {
        this._up = upVector;
    }
    update() {
        glMatrix.mat4.lookAt(this._cameraMatrix, this._eye, this._target, this._up);
        glMatrix.mat4.invert(this._viewMatrix, this._cameraMatrix);
        glMatrix.mat4.multiply(this._viewProjectionMatrix, this._pMatrix, this._viewMatrix);
        this._gl.uniformMatrix4fv(this._location, false, this._viewProjectionMatrix);
    }
}
//# sourceMappingURL=qdOrthoCamera.js.map