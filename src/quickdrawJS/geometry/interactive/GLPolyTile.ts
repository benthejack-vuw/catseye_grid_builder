import OrthoGLCanvas from "../../webGL/qdOrthoGLCanvas"
import DisplayObject from "../../canvas/displayObject"
import * as DrawingUtils from "../../util/drawingUtils"
import GLMirrorPoly from "./GLMirrorPolygon"
import Point from "../point"

export default class GLPolyTile extends DisplayObject{

  private _polygons:Array<GLMirrorPoly>;
  private _textureSelection:Array<Point>;
  private _texture:HTMLImageElement;
  private _grid:any;

	private _glCanvas:OrthoGLCanvas;

  private _maxSize:Point;
  private _scale:number;

	constructor(position:Point, maxSize:Point, texture:HTMLImageElement, grid:any){
    super(position, maxSize);
    this._maxSize = maxSize.copy();
    this.clearColor(0);

    this.setCacheAsCanvas(true);

    this._textureSelection = [new Point(0,0), new Point(1,0), new Point(1,1)];
    
    this._glCanvas = new OrthoGLCanvas(this._size, vertexShader, fragmentShader, "u_matrix");

    this.updateGrid(grid);
    this.updateTexture(texture);
	}

  public setSelection(coords:Array<Point>){
    this._textureSelection = coords;
  }

  public updateTexture(image:HTMLImageElement){
    this._texture = image;
    this._glCanvas.setTexture("u_texture", image);
  }

  public updateGrid(grid:any){
    this._grid = grid === undefined || !grid ? hexGrid : grid;

    this.size.y = this._size.x * this._grid.normalized_clipRect.height;
    this._canvas.height = this.size.y;
    this._glCanvas.setView(this._size);
    this._polygons = [];
    
    for (var i = 0; i < this._grid.normalized_polygons.length; ++i) {
      this._polygons.push(new GLMirrorPoly(this._grid.normalized_polygons[i]));
    }
  }

	public draw(context:CanvasRenderingContext2D){
      
      if(this._texture){
        this.drawPolygons();
        context.drawImage(this._glCanvas.canvas,0,0);
      }
  }

  private drawPolygons(){
    for (var i = 0; i < this._polygons.length; ++i) {
      this.drawPolygon(this._polygons[i]);
    }
  }

  private drawPolygon(poly:GLMirrorPoly){
      this._glCanvas.setbuffer("a_position", poly.GLPoints(), 3);
      this._glCanvas.setbuffer("a_texcoord", poly.GLTexCoords(this._textureSelection), 2);
      this._glCanvas.render(this._glCanvas.glContext.TRIANGLE_FAN, poly.length+2);
  }

  public set scale(scale:number){
    this._scale = scale;
    this.size = new Point(this._maxSize.x*scale, this._maxSize.y*scale);
    this._glCanvas.setView(this.size);
  }

   public patternRect(context:CanvasRenderingContext2D, position:Point, size:Point, scale:number){
      const pattern = context.createPattern(this._canvas, "repeat");
      context.rect(position.x, position.y, size.x, size.y);
      context.fillStyle = pattern;
      context.fill();
  }

  public contains(pt:Point){
    return this.inBounds(pt);
  }

  public destroy(){
    this._glCanvas.destroy();
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