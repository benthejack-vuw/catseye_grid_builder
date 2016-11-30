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
	private _showGrid:boolean;

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
		this.showDefaultGrids();

	}

	public set dirty(dirty:boolean){
		this._dirty = true;
	}

	public reset = (skipConfirm?:boolean)=>{
		if(skipConfirm || confirm("This will revert the image and texture co-ordinates back to their defaults. Are you SURE you want to do this?")){
			let img = document.getElementById("defaultImage") as HTMLImageElement;
			this.setImage(img);
			LocalStore.remove("selectionImage");
			this.changeScale(0.5, null);
			this.setGrid(null);
			this.updateTextureCoordinates(this._imageSelector.selection);
			this._dirty = true;

			var imgUrl = DomUtils.dataURLfromImage(img);
			LocalStore.store("selectionImage", imgUrl);
			location.reload();
		}

	}

	public loadLastSession(){
	
		try{	
			const self = this;

			if(LocalStore.contains("selectionImage")){
				DomUtils.buildImageFromURL(LocalStore.get("selectionImage")).then(
					(image)=>{
						self.setImage(image);
						this._imageSelector.setTextureCoords(LocalStore.getJSON("texCoords"));
						this._imageSelector.forceUpdate();
					}
				)
			}
			
			if(LocalStore.contains("currentGrid")){
				self.setGrid(LocalStore.getJSON("currentGrid"));
			}

			if(LocalStore.contains("scale")){
				const val = LocalStore.get("scale");
				self.changeScale(val, null);
				this._dirtyScaleHack = val;
				this._dirty = true;
			}
			
		}catch(e){
			alert("your local data has been corrupted, your workspace has been reset");
			this.clearLocalStore();
		}
	}

	public addedToStage(){
	}

	public loadImage = async ()=>{
        const file = await DomUtils.selectImage();
        console.log("file selected");
        const url = await DomUtils.readImageAsURL(file);
       	const image = await DomUtils.buildImageFromURL(url);
        this.setImage(image);
        LocalStore.store("selectionImage", url);
        this._imageSelector.forceUpdate();
    }

	public loadGrid = (val:any, obj:any)=>{
		
        DomUtils.selectFile().then((file)=>{
        	return DomUtils.readFileAsJSON(file);
        }).then((grid)=>{
        	this.setGrid(grid);
        	GridStorage.saveGrid(grid);
			GridStorage.createCustomGridSelectors("custom-grids",this);
			this.showCustomGrids();
        });

	}

	public saveImage = (val:any, obj:any)=>{
		var canvas = document.createElement("canvas");
		canvas.width = this._saveSize.x;
		canvas.height = this._saveSize.y;
		this._glTile.redraw();
		this._glTile.patternRect(canvas.getContext("2d"), new Point(0,0), this._saveSize, this._tileScale);
		var sel = document.getElementById('save-format') as HTMLInputElement;
        DomUtils.downloadCanvasImage(canvas, "catseyePattern", sel.value);
	}

	public saveTile = (val:any, obj:any)=>{
		this._glTile.redraw();
		var sel = document.getElementById('save-format') as HTMLInputElement;
        DomUtils.downloadCanvasImage(this._glTile.renderCanvas, "catseyePattern", sel.value);
	}

	public saveWidth = (val:any)=>{
		this._saveSize.x = val;
	}

	public saveHeight = (val:any)=>{
		this._saveSize.y = val;
	}

	public toggleGridDisplay = (val:any, obj:any)=>{
		this._showGrid = !this._showGrid;
		this._glTile.showGrid(this._showGrid);
		obj.innerHTML = this._showGrid ? "Hide Grid" : "Show Grid";
		this._dirty = true;
	}

	public changeScale = (val:any, obj:any)=>{

		val = Math.clamp(val, 0.005, 1);
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

		this._glTile.scale = val*.25;
		LocalStore.store("scale", val);
		this._dirty = true;
	}

	public clearLocalStore = ()=>{
		if(confirm("WARNING: This wil delete ALL your settings and custom grids from the browsers localStore. Are you SURE you want to do this?")){
			LocalStore.clearAll();
			this.reset(true);
		}
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
			if(context.canvas.width > 0 && context.canvas.height > 0)
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
		if(this._imageSelector)
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

		this._glTile = new GLPolyTile(new Point(0,0), new Point(1024,1024), this._texture, this._grid);
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

	public showDefaultGrids = ()=>{
		var defaultGrids = document.getElementById("default-grids");
		var customGrids = document.getElementById("custom-grids");
		customGrids.setAttribute("style", "display:none");
		defaultGrids.setAttribute("style", "");
		
		document.getElementById("showCustomGrids").setAttribute("class", "");
		document.getElementById("showDefaultGrids").setAttribute("class", "selected");
	}

	public showCustomGrids = ()=>{
		var defaultGrids = document.getElementById("default-grids");
		var customGrids = document.getElementById("custom-grids");
		defaultGrids.setAttribute("style", "display:none");
		customGrids.setAttribute("style", "");
		document.getElementById("showDefaultGrids").setAttribute("class", "");
		document.getElementById("showCustomGrids").setAttribute("class", "selected");
	}

}
