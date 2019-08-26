export class QDShaderCompiler{

	static createProgram(glCtx, vertexShader, fragmentShader) {
	  // create a program.
	  const program = glCtx.createProgram();
	  const compiledVertexShader = QDShaderCompiler.compileShader(glCtx, vertexShader, glCtx.VERTEX_SHADER);
	  const compiledFragmentShader = QDShaderCompiler.compileShader(glCtx, fragmentShader, glCtx.FRAGMENT_SHADER);

	  // attach the shaders.
	  glCtx.attachShader(program, compiledVertexShader);
	  glCtx.attachShader(program, compiledFragmentShader);

	  // link the program.
	  glCtx.linkProgram(program);

	  // Check if it linked.
	  const success = glCtx.getProgramParameter(program, glCtx.LINK_STATUS);
	  if (!success) {
	      // something went wrong with the link
	      throw ("program filed to link:" + glCtx.getProgramInfoLog (program));
	  }

	  return program;
	};

  static compileShader(glCtx, shaderSource, shaderType) {
    // Create the shader object
    const shader = glCtx.createShader(shaderType);

    // Set the shader source code.
    glCtx.shaderSource(shader, shaderSource);

    // Compile the shader
    glCtx.compileShader(shader);

    // Check if it compiled
    const success = glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS);
    if (!success) {
      // Something went wrong during compilation; get the error
      throw "could not compile shader:" + glCtx.getShaderInfoLog(shader);
    }

    return shader;
  }
}
