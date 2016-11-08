import GLPolyTile from "../quickdrawJS/geometry/interactive/GLPolyTile"
import Stage from "../quickdrawJS/canvas/stage"
import DisplayObject from "../quickdrawJS/canvas/displayObject"
import ImageAreaSelector from "../quickdrawJS/geometry/interactive/imageAreaSelector"
import Point from "../quickdrawJS/geometry/point"
import * as DomUtils from "../quickdrawJS/util/domUtils"

export default class PatternBuilder extends DisplayObject{	

	private _selectionStage:Stage;
	private _imageSelector:ImageAreaSelector;
	private _textureCoordinates:Array<Point>;
	private _glTile:GLPolyTile;
	private _grid:any;
	private _texture:HTMLImageElement;
	private _tileScale:number = 1;

	private _dirty = true;
	private _pause = true;

	constructor(){
		super(new Point(0,0), new Point(window.innerWidth, window.innerHeight));
		this.setCacheAsCanvas(true);
		var empty = new Point(0,0);
		this._textureCoordinates = [empty, empty, empty];
		this._selectionStage = new Stage("image-selection", new Point(260,260));
		this.setupTile();
	}

	public loadImage = (val:any, obj:any)=>{
		
        DomUtils.selectImage().then((file)=>{
        	return DomUtils.readImageAsURL(file);
        }).then((imageURL)=>{
        	return DomUtils.buildImageFromURL(imageURL);
        }).then((image)=>{
        	this.setImage(image);
        }).catch((error)=>{
        	console.log(error);
        });

	}

	public loadGrid = (val:any, obj:any)=>{
		
		(async () => {
            // Prompt for an image.
            const file = await DomUtils.selectFile();
            // Load the image as a pattern and store it if possible.
            const grid = await DomUtils.readFileAsJSON(file);
		
			this.setGrid(grid);
        })();

	}

	public changeScale = (val:any)=>{
		this._glTile.scale = val;
	}

	public draw(context:CanvasRenderingContext2D){
		this._glTile.redraw();
		this._glTile.patternRect(context, new Point(0,0), this._size, this._tileScale);
	}

	public updateTextureCoordinates = (pts:Array<Point>)=>{
		this._textureCoordinates = pts;
		this._glTile.setSelection(this._textureCoordinates);
	}

	public setImage(image:HTMLImageElement){
		this._texture = image;
		this._selectionStage.removeChild(this._imageSelector);
		this._imageSelector = new ImageAreaSelector(this._texture, 260, this.updateTextureCoordinates);
		this._selectionStage.addChild(this._imageSelector);
	}

	public setGrid(grid:any){
		this._grid = grid;
	}

	public setupTile(){
		this._glTile = new GLPolyTile(new Point(0,0), new Point(2048,2048), this._texture, this._grid);
		
		if(this._imageSelector)
			this._textureCoordinates = this._imageSelector.selection;

		this._glTile.setSelection(this._textureCoordinates);

		this._glTile.updateTexture(this._texture);
		this._glTile.updateGrid(this._grid);

		this._glTile.redraw();
	}

	public update(){
		if(this._dirty && !this._pause){
			this.setupTile();
			this._dirty = false;
		}
	}

	public contains(pt:Point){
		return true;
	}

}