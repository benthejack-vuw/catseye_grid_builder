import DisplayObject from "../quickdrawJS/canvas/displayObject"
import Point from "../quickdrawJS/geometry/point"

export default class PatternBuilder extends DisplayObject{	

	constructor(){
		super(new Point(0,0), new Point(window.innerWidth, window.innerHeight));
	}

	public loadImage = (val:any, obj:any)=>{
	}

	public contains(pt:Point){
		return true;
	}

}