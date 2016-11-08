/// <reference path="../../../../typings/index.d.ts" />

import DisplayObject from "../../canvas/displayObject"
import * as DrawingUtils from "../../util/drawingUtils"
import GLMirrorPoly from "./GLMirrorPolygon"
import Point from "../point"

export default class GLPolyTile extends DisplayObject{

  private _polygons:Array<GLMirrorPoly>;
  private _textureSelection:Array<Point>;
  private _grid:any;

	private _webGLCanvas:HTMLCanvasElement;
	private _gl:WebGLRenderingContext;

  private _shaderProgram:WebGLProgram;
	private _positionLocation:number;
	private _texcoordLocation:number;
	private _matrixLocation:WebGLUniformLocation;
	private _textureLocation:WebGLUniformLocation;
  private _positionBuffer:WebGLBuffer;
  private _texcoordBuffer:WebGLBuffer;

  private _imageElement:HTMLImageElement;
  private _texture:WebGLTexture;

  private _pMatrix:glMatrix.mat4 = glMatrix.mat4.create();
  private _cameraMatrix:glMatrix.mat4 = glMatrix.mat4.create();
  private _viewMatrix:glMatrix.mat4 = glMatrix.mat4.create();
  private _viewProjectionMatrix:glMatrix.mat4 = glMatrix.mat4.create();

	constructor(position:Point, size:Point, texture:HTMLImageElement, grid:any){
    super(position, size);
    this.clearColor(0);
    this.size.y *= hexGrid.normalized_clipRect.height;
    this.setCacheAsCanvas(true);

    this._textureSelection = [new Point(0,0), new Point(1,0), new Point(1,1)];
    this._imageElement = texture;

    this.setupWebGL();
    this.setupShaderProgram();
    this.setupBuffers();
    this.setupTexture();
    this.setupView();
  
    this.updateGrid(grid);
    this.updateTexture(texture);
	}

  public setSelection(coords:Array<Point>){
    this._textureSelection = coords;
  }

  private setupWebGL(){
    this._webGLCanvas = document.createElement("canvas");
    this._webGLCanvas.setAttribute("width", String(this._size.x));
    this._webGLCanvas.setAttribute("height", String(this._size.y));
    this._gl = this._webGLCanvas.getContext("webgl") as WebGLRenderingContext;
    if (!this._gl) {
      console.log("NO WEBGL!");
    }
  }

  private setupShaderProgram(){
    this._shaderProgram = this.createProgram(this._gl, vertexShader, fragmentShader);
     // look up where the vertex data needs to go.
    this._positionLocation = this._gl.getAttribLocation(this._shaderProgram, "a_position");
    this._texcoordLocation = this._gl.getAttribLocation(this._shaderProgram, "a_texcoord");
    // lookup uniforms
    this._matrixLocation = this._gl.getUniformLocation(this._shaderProgram, "u_matrix");
    this._textureLocation = this._gl.getUniformLocation(this._shaderProgram, "u_texture");
  }

  private setupBuffers(){
    // Create a buffer for positions
    this._positionBuffer = this._gl.createBuffer();
    // provide texture coordinates for the rectangle.
    this._texcoordBuffer = this._gl.createBuffer();
  }

  private setupTexture(){
    
    this._texture = this._gl.createTexture();
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);    

    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, 1, 1, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE,
                new Uint8Array([255, 255, 255, 255]));
 
    // this._gl.NEAREST is also allowed, instead of this._gl.LINEAR, as neither mipmap.
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
    // Prevents s-coordinate wrapping (repeating).
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
    // Prevents t-coordinate wrapping (repeating).
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
    
  }

  public updateTexture(image:HTMLImageElement){
    this._imageElement = image;
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);    
    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA,this._gl.UNSIGNED_BYTE, image);
  }

  public updateGrid(grid:any){
    this._grid = grid === undefined || !grid ? hexGrid : grid;

    this.size.y = this._size.x * this._grid.normalized_clipRect.height;
    this._canvas.height = this.size.y;
    this._webGLCanvas.setAttribute("height", String(this._size.y));
    this._polygons = [];
    
    for (var i = 0; i < this._grid.normalized_polygons.length; ++i) {
      this._polygons.push(new GLMirrorPoly(this._grid.normalized_polygons[i]));
    }
  }

  private setupView(){
    // Tell WebGL how to convert from clip space to pixels
    this._gl.viewport(0, 0, this._size.x, this._size.x);
    // Tell it to use our program (pair of shaders)
    this._gl.useProgram(this._shaderProgram);

    glMatrix.mat4.ortho(this._pMatrix, 0, 1, 0, 1, -1, 1);

    var cameraPosition = [0, 0, 1];
    var up = [0, 1, 0];
    var target = [0, 0, 0];

    // Compute the camera's matrix using look at.
    glMatrix.mat4.lookAt(this._cameraMatrix, cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    glMatrix.mat4.invert(this._viewMatrix, this._cameraMatrix);
    glMatrix.mat4.multiply(this._viewProjectionMatrix, this._pMatrix, this._viewMatrix);

    // Set the matrix.
    this._gl.uniformMatrix4fv(this._matrixLocation, false, this._pMatrix);

    // Tell the shader to use texture unit 0 for u_texture
    this._gl.uniform1i(this._textureLocation, 0);
  }

  
  private setGeometry(positions:Array<number>) {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._positionBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(positions), this._gl.STATIC_DRAW);
  }

  private setTexcoords(texCoords:Array<number>) {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._texcoordBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(texCoords), this._gl.STATIC_DRAW);
  }

	public draw(context:CanvasRenderingContext2D){
      
      this._gl.clear(this._gl.COLOR_BUFFER_BIT);
      
      this.drawPolygons();
      context.drawImage(this._webGLCanvas,0,0);
    
  }

  private drawPolygons(){
    for (var i = 0; i < this._polygons.length; ++i) {
      this.drawPolygon(this._polygons[i]);
    }
  }

  private drawPolygon(poly:GLMirrorPoly){

      this._gl.enableVertexAttribArray(this._positionLocation);
      this.setGeometry(poly.GLPoints());

      // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      var size = 3;          // 3 components per iteration
      var type = this._gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0;        // start at the beginning of the buffer
      this._gl.vertexAttribPointer(this._positionLocation, size, type, normalize, stride, offset);


      // Turn on the teccord attribute
      this._gl.enableVertexAttribArray(this._texcoordLocation);
      this.setTexcoords(poly.GLTexCoords(this._textureSelection));

      // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      var size = 2;          // 2 components per iteration
      var type = this._gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0;        // start at the beginning of the buffer
      this._gl.vertexAttribPointer(this._texcoordLocation, size, type, normalize, stride, offset);


      // Draw the geometry.
      this._gl.drawArrays(this._gl.TRIANGLE_FAN, 0, poly.length+2);
  }

   public patternRect(context:CanvasRenderingContext2D, position:Point, size:Point, scale:number){
      
      var scaled = document.createElement("canvas");
      scaled.setAttribute("width", String(this._size.x * scale));
      scaled.setAttribute("height", String(this._size.y * scale));
      var ctx = scaled.getContext("2d");
      ctx.drawImage(this._canvas,0,0,scaled.width, scaled.height);

      const pattern = context.createPattern(scaled, "repeat");
      
      context.rect(position.x, position.y, size.x, size.y);
      context.fillStyle = pattern;
      context.fill();
  }

  public contains(pt:Point){
    return this.inBounds(pt);
  }

  public destroy(){
    this._gl.deleteTexture(this._texture);
    this._gl.deleteBuffer(this._positionBuffer);
    this._gl.deleteBuffer(this._texcoordBuffer);
  }

	public createProgram(gl:WebGLRenderingContext, vertexShader:string, fragmentShader:string) {
	  // create a program.
	  var program = gl.createProgram();
	   
    var compiledVertexShader = this.compileShader(gl, vertexShader, gl.VERTEX_SHADER);
    var compiledFragmentShader = this.compileShader(gl, fragmentShader, gl.FRAGMENT_SHADER);

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

  /**
   * Creates and compiles a shader.
   *
   * @param {!WebGLRenderingContext} gl The WebGL Context.
   * @param {string} shaderSource The GLSL source code for the shader.
   * @param {number} shaderType The type of shader, VERTEX_SHADER or
   *     FRAGMENT_SHADER.
   * @return {!WebGLShader} The shader.
   */
  private compileShader(gl:WebGLRenderingContext, shaderSource:string, shaderType:number) {
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

var hexGrid:any = JSON.parse(`{"polygons":[[{"x":60,"y":0},{"x":0.00007960769380065197,"y":59.99999999994719},{"x":-59.999999999788756,"y":0.0001592153876011638},{"x":-0.00023882308142804073,"y":-59.9999999995247}],[{"x":-0.0002727979104122369,"y":-60.00001407228705},{"x":-0.0004979629190131618,"y":-144.85299668762633},{"x":59.99942242854223,"y":-204.85331511834875},{"x":144.85240504350807,"y":-204.85365286586165},{"x":204.85280308176584,"y":-144.8538120825695},{"x":204.85325341178304,"y":-60.00082946812643},{"x":144.8534922367657,"y":-0.0003518224389580382},{"x":60.0005096229948,"y":0.00021109008255848494}],[{"x":0.00011358243264680823,"y":60.000014072672194},{"x":0.0003387468437665575,"y":144.85277152360032},{"x":-59.99942242986359,"y":204.85293073851264},{"x":-144.8521798804183,"y":204.85326848512932},{"x":-204.85241870265475,"y":144.8535869163798},{"x":-204.85286903147693,"y":60.00082946634787},{"x":-144.853267070791,"y":0.0005110368930019149},{"x":-60.00050962143123,"y":-0.00005187413479745828}],[{"x":-0.00025872500160062373,"y":-59.99998009751874},{"x":-60.0001791164628,"y":0.0003383332036293041},{"x":-144.85316173142866,"y":0.0006760807165306915},{"x":-204.8535597696864,"y":-59.99916470257557},{"x":-204.8540100997036,"y":-144.85214731701862},{"x":-144.85424892468617,"y":-204.8526249627061},{"x":-60.00126631091539,"y":-204.8531878752276},{"x":-0.0007090579037623002,"y":-144.85350630859057}],[{"x":144.853526211478,"y":-0.0003658954830143557},{"x":204.85408346448963,"y":59.99931567115405},{"x":204.85475895951544,"y":144.85229828410343},{"x":144.85515700136438,"y":204.85293514433357},{"x":60.002174389385935,"y":204.85372322186367},{"x":0.0014579220429027373,"y":144.85420087230415},{"x":0.0005572620084990376,"y":60.00121826144608},{"x":60.00000000287079,"y":0.0004221870957792362}]],"bounds":{"x":-102.42717421697355,"y":-102.426845128397,"width":204.85488861861802,"height":204.85357767407206},"normalized_clipRect":{"x":0,"y":0,"width":1,"height":0.9999936006186877},"normalized_polygons":[[{"x":0.7928889337826207,"y":0.4999970750958591},{"x":0.499999070148421,"y":0.792887327335093},{"x":0.20710842930466855,"y":0.499997852306443},{"x":0.499997515727253,"y":0.20710682285868764}],[{"x":0.4999973498789825,"y":0.20710675416243904},{"x":0.4999962507350464,"y":-0.20710343719555965},{"x":0.7928861143651215,"y":-0.49999524385596145},{"x":1.2070963057212971,"y":-0.4999968925718656},{"x":1.4999885009862173,"y":-0.20710741754940268},{"x":1.4999906992740895,"y":0.20710277380422118},{"x":1.207101612859755,"y":0.4999953576731443},{"x":0.7928914215094123,"y":0.4999981055329845}],[{"x":0.49999923599625146,"y":0.7928873960311592},{"x":0.5000003351372709,"y":1.2070964882481383},{"x":0.20711124871468634,"y":1.4999875176958937},{"x":-0.20709784350046992,"y":1.499989166407423},{"x":-0.49998926155171275,"y":1.2071004685914193},{"x":-0.49999145983375143,"y":0.7928913763788149},{"x":-0.20710315062484472,"y":0.4999995697246007},{"x":0.20710594158447837,"y":0.499996821872052}],[{"x":0.49999741857594604,"y":0.2071069200104134},{"x":0.2071075549458712,"y":0.49999872667081496},{"x":-0.20710263641030463,"y":0.500000375386719},{"x":-0.4999948316752248,"y":0.2071109003642564},{"x":-0.499997029963097,"y":-0.20709929098936736},{"x":-0.20710794354876177,"y":-0.4999918748582905},{"x":0.20710224780158032,"y":-0.49999462271813067},{"x":0.4999952202739909,"y":-0.207105924912439}],[{"x":1.2071017787074558,"y":0.49999528897552054},{"x":1.4999947511798666,"y":0.7928839867812123},{"x":1.4999980486116749,"y":1.2070941781275448},{"x":1.207109739415142,"y":1.4999875392029272},{"x":0.7928995480735492,"y":1.4999913862067036},{"x":0.5000057983957106,"y":1.2071034656198452},{"x":0.5000014018199662,"y":0.7928932742837214},{"x":0.7928889337966345,"y":0.499999136003942}]]}`);

var vertexShader = `
attribute vec4 a_position;
attribute vec2 a_texcoord;
 
uniform mat4 u_matrix;
 
varying vec2 v_texcoord;
 
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;
 
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}`

var fragmentShader = `
precision mediump float;
 
// Passed in from the vertex shader.
varying vec2 v_texcoord;
 
// The texture.
uniform sampler2D u_texture;
 
void main() {
   gl_FragColor = texture2D(u_texture, v_texcoord);
}`