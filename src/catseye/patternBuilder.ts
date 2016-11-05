import Stage from "../quickdrawJS/canvas/stage"
import DisplayObject from "../quickdrawJS/canvas/displayObject"
import ImageAreaSelector from "../quickdrawJS/geometry/interactive/imageAreaSelector"
import Point from "../quickdrawJS/geometry/point"
import * as DomUtils from "../quickdrawJS/util/domUtils"

export default class PatternBuilder extends DisplayObject{	

	private _selectionStage:Stage;
	private _imageSelector:ImageAreaSelector;
	private _textureCoordinates:Array<Point>;

	constructor(){
		super(new Point(0,0), new Point(window.innerWidth, window.innerHeight));
		this._selectionStage = new Stage("image-selection", new Point(260,260));
	}

	public loadImage = (val:any, obj:any)=>{
		
		var self = this;

		(async function () {
            // Prompt for an image.
            const file = await DomUtils.selectImage();
            // Read the file as a data URL.
            const url = await DomUtils.readImageAsURL(file);
            // Load the image as a pattern and store it if possible.
            const image:HTMLImageElement = await DomUtils.buildImageFromURL(url);

            self.setImage(image);
        })();

	}

	public updateTextureCoordinates = (pts:Array<Point>)=>{
		this._textureCoordinates = pts;
		this.updatePattern();
	}

	public setImage(image:HTMLImageElement){
		this.removeChild(this._imageSelector);
		this._imageSelector = new ImageAreaSelector(image, 260, this.updateTextureCoordinates);
		this._selectionStage.addChild(this._imageSelector);
	}

	public updatePattern(){
		//console.log(this._textureCoordinates);
	}

	public contains(pt:Point){
		return true;
	}

}