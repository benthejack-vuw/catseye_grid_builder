export class QDShaderCompiler{


	public static createProgram(gl:WebGLRenderingContext, vertexShader:string, fragmentShader:string) {
	  // create a program.
	  var program = gl.createProgram();

	  var compiledVertexShader = QDShaderCompiler.compileShader(gl, vertexShader, gl.VERTEX_SHADER);
	  var compiledFragmentShader = QDShaderCompiler.compileShader(gl, fragmentShader, gl.FRAGMENT_SHADER);

	  // attach the shaders.
	  gl.attachShader(program, compiledVertexShader);
	  gl.attachShader(program, compiledFragmentShader);

	  // link the program.
	  gl.linkProgram(program);

	  // Check if it linked.
	  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
	  if (!success) {
	      // something went wrong with the link
	      throw ("program filed to link:" + gl.getProgramInfoLog (program));
	  }

	  return program;
	};

  public static compileShader(gl:WebGLRenderingContext, shaderSource:string, shaderType:number) {
    // Create the shader object
    var shader = gl.createShader(shaderType);

    // Set the shader source code.
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check if it compiled
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      // Something went wrong during compilation; get the error
      throw "could not compile shader:" + gl.getShaderInfoLog(shader);
    }

    return shader;
  }
}
