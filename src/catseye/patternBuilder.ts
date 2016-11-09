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

	private _saveSize:Point;

	constructor(){
		super(new Point(0,0), new Point(window.innerWidth, window.innerHeight));
		this._saveSize = new Point(
			parseInt((document.getElementById("save-width") as HTMLInputElement).value), 
			parseInt((document.getElementById("save-height") as HTMLInputElement).value)
		);
		this.setCacheAsCanvas(true);
		this._textureCoordinates = [new Point(0,0), new Point(1,1), new Point(0,1)];
		this._texture = document.getElementById("defaultImage") as HTMLImageElement;
		this._selectionStage = new Stage("image-selection", new Point(260,260));
		this.setupTile();
	}

	public addedToStage(){
		this.addChild(this._glTile);
	}

	public loadImage = async ()=>{
        const file = await DomUtils.selectImage();
        console.log("file selected");
        const url = await DomUtils.readImageAsURL(file);
       	const image = await DomUtils.buildImageFromURL(url);
        this.setImage(image);
    }

	public loadGrid = (val:any, obj:any)=>{
		
        DomUtils.selectFile().then((file)=>{
        	return DomUtils.readFileAsJSON(file);
        }).then((grid)=>{
        	this.setGrid(grid);
        });

	}

	public saveImage = (val:any, obj:any)=>{
		var canvas = document.createElement("canvas");
		canvas.width = this._saveSize.x;
		canvas.height = this._saveSize.y;
		console.log(this._saveSize);
		this._glTile.redraw();
		this._glTile.patternRect(canvas.getContext("2d"), new Point(0,0), this._saveSize, this._tileScale);
        DomUtils.downloadCanvasImage(canvas, "catseyePattern.jpg");
	}

	public saveTile = (val:any, obj:any)=>{
		this._glTile.redraw();
        DomUtils.downloadCanvasImage(this._glTile.renderCanvas, "catseyePattern.jpg");
	}

	public saveWidth = (val:any)=>{
		this._saveSize.x = val;
	}

	public saveHeight = (val:any)=>{
		this._saveSize.y = val;
	}

	public toggleGridDisplay = (val:any, obj:any)=>{
		this._glTile.showGrid(obj.checked);
	}

	public changeScale = (val:any, obj:any)=>{
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
		this._glTile.updateTexture(image);
	}

	public setGrid(grid:any){
		this._grid = grid;
		this._glTile.updateGrid(grid);
	}

	public setupTile(){
		this._glTile = new GLPolyTile(new Point(0,0), new Point(2048,2048), this._texture, this._grid);
		this.setImage(this._texture);

		if(this._imageSelector)
			this._textureCoordinates = this._imageSelector.selection;

		this._glTile.setSelection(this._textureCoordinates);

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