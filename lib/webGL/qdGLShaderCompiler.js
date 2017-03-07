export class QDShaderCompiler {
    static createProgram(gl, vertexShader, fragmentShader) {
        var program = gl.createProgram();
        var compiledVertexShader = QDShaderCompiler.compileShader(gl, vertexShader, gl.VERTEX_SHADER);
        var compiledFragmentShader = QDShaderCompiler.compileShader(gl, fragmentShader, gl.FRAGMENT_SHADER);
        gl.attachShader(program, compiledVertexShader);
        gl.attachShader(program, compiledFragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) {
            throw ("program filed to link:" + gl.getProgramInfoLog(program));
        }
        return program;
    }
    ;
    static compileShader(gl, shaderSource, shaderType) {
        var shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
            throw "could not compile shader:" + gl.getShaderInfoLog(shader);
        }
        return shader;
    }
}
//# sourceMappingURL=qdGLShaderCompiler.js.map