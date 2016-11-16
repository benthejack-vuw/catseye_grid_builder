import GridStorage from "./grids/gridStorage"
import * as LocalStore from "../quickdrawJS/storage/localStore"
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

	private _dirtyScaleHack:number = -1; //in chrome the slider seems to glitch when value is set in code the first time this forces a refresh

	constructor(){
		super(new Point(0,0), new Point(window.innerWidth, window.innerHeight));
		this._saveSize = new Point(
			parseInt((document.getElementById("save-width") as HTMLInputElement).value), 
			parseInt((document.getElementById("save-height") as HTMLInputElement).value)
		);
		this.setCacheAsCanvas(true);
		this._textureCoordinates = [new Point(0,0), new Point(1,1), new Point(0,1)];
		this._selectionStage = new Stage("image-selection", new Point(280,280));
		this._texture = document.getElementById("defaultImage") as HTMLImageElement;
		this.setupTile();

		if(LocalStore.contains("selectionImage") || LocalStore.contains("currentGrid") || LocalStore.contains("scale")){
			this.loadLastSession();
		}

		GridStorage.createDefaultGridSelectors("default-grids",this);
		GridStorage.createCustomGridSelectors("custom-grids",this);

		var defaultGrids = document.getElementById("default-grids");
		var customGrids = document.getElementById("custom-grids");

		document.getElementById("showDefaultGrids").addEventListener("click", ()=>{
			customGrids.setAttribute("style", "display:none");
			defaultGrids.setAttribute("style", "");
		});

		document.getElementById("showCustomGrids").addEventListener("click", ()=>{
			defaultGrids.setAttribute("style", "display:none");
			customGrids.setAttribute("style", "");
		});
		
	}

	public reset = ()=>{
		let img = document.getElementById("defaultImage") as HTMLImageElement;
		this.setImage(img);
		LocalStore.remove("selectionImage");
		this.changeScale(1, null);
		this.setGrid(null);
		this.updateTextureCoordinates(this._imageSelector.selection);
		this._dirty = true;

		var imgUrl = DomUtils.dataURLfromImage(img);
		LocalStore.store("selectionImage", imgUrl);

	}

	public loadLastSession(){
	
		const self = this;

		DomUtils.buildImageFromURL(LocalStore.get("selectionImage")).then(
			(image)=>{
				self.setImage(image);
				this._imageSelector.setTextureCoords(LocalStore.getJSON("texCoords"));
			}
		)
		
		self.setGrid(LocalStore.getJSON("currentGrid"));
		const val = LocalStore.get("scale");
		self.changeScale(val, null);
		this._dirtyScaleHack = val;
		this._dirty = true;
	}

	public addedToStage(){
		//this.addChild(this._glTile);
	}

	public loadImage = async ()=>{
        const file = await DomUtils.selectImage();
        console.log("file selected");
        const url = await DomUtils.readImageAsURL(file);
       	const image = await DomUtils.buildImageFromURL(url);
        this.setImage(image);
        LocalStore.store("selectionImage", url);
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
		this._dirty = true;
	}

	public changeScale = (val:any, obj:any)=>{

		val = Math.clamp(val, 0.001, 2);
		const box = document.getElementById("tile-scale-box") as HTMLInputElement;
		const slider = document.getElementById("tile-scale-slider") as HTMLInputElement;
		
		if(obj === box){
			slider.value = val;
		}else if(obj == slider){
			box.value = val;
		}else{
			slider.value = val;
			box.value = val;
		}

		this._glTile.scale = val;
		LocalStore.store("scale", val);
		this._dirty = true;
	}

	public draw(context:CanvasRenderingContext2D){

		if(this._dirtyScaleHack >= 0){
			this.changeScale(this._dirtyScaleHack, null);
			this._dirtyScaleHack = -1;
		}

		if(this._dirty){//stops render flickering
			this.clear(context, true);
			this._glTile.redraw();
			this._dirty = false;
			this._glTile.patternRect(context, new Point(0,0), this._size, this._tileScale);
		}

	}

	public updateTextureCoordinates = (pts:Array<Point>)=>{
		this._textureCoordinates = pts;
		this._glTile.setSelection(this._textureCoordinates);
		LocalStore.storeJSON("texCoords", this._textureCoordinates);
		this._dirty = true;
	}

	public setImage(image:HTMLImageElement){
		this._texture = image;
		this._selectionStage.removeChild(this._imageSelector);
		this._imageSelector = new ImageAreaSelector(this._texture, this._selectionStage.size.x, this.updateTextureCoordinates);
		this._selectionStage.addChild(this._imageSelector);
		this._glTile.updateTexture(image);
		this._dirty = true;
	}

	public setGrid(grid:any){
		this._grid = grid;
		this._glTile.updateGrid(grid);
		LocalStore.storeJSON("currentGrid", this._grid);
		this._dirty = true;
	}

	public setupTile(){
		
		if(this._glTile)
			this._glTile.destroy();

		this._glTile = new GLPolyTile(new Point(0,0), new Point(2048,2048), this._texture, this._grid);
		this.setImage(this._texture);

		if(this._imageSelector)
			this._textureCoordinates = this._imageSelector.selection;

		this._glTile.setSelection(this._textureCoordinates);

		this._glTile.updateGrid(this._grid);

		this._glTile.redraw();
	}

	public contains(pt:Point){
		return true;
	}

}