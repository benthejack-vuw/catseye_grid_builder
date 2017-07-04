import {Point} from "bj-utils/lib/geometry/point"
import * as DomUtils from "bj-utils/lib/util/domUtils"

import {GridStorage} from "./gridStorage"
import {PolygonTile} from "../geometry/polygonTile"


const tabs:string[] = ["default-grids", "custom-grids"];


export class GridManager{
	private _tabs:any;

	constructor(private _callbackObject){
		this._tabs = {};

		for (var i = 0; i < tabs.length; ++i) {
			this._tabs[tabs[i]] = [];
		}

		this.setupTab("default-grids", GridStorage.defaultGrids, false);
		this.setupTab("custom-grids", GridStorage.customGrids);
	}

	private setupTab(tab:string, data:any[], deletable:boolean = true){
		for (var i = 0; i < data.length; ++i) {
			this.addFromData(data[i], tab, deletable);
		}
	}

	private generateButton(tab:string, deletable:boolean):GridButton{
		return new GridButton(this,
							  document.getElementById(tab),
							  this._callbackObject,
							  deletable);

	}

	public addFromFile(path:string, tab:string, deletable:boolean = true, save:boolean = false){
		let button = this.generateButton(tab, deletable);
		this._tabs[tab].push(button);
		button.fromFile(path, save);
	}

	public addFromData(data:any, tab:string, deletable:boolean = true){
		let button = this.generateButton(tab, deletable);
		this._tabs[tab].push(button);
		button.fromData(data);
	}

	public delete(grid:GridButton){
		for (var i = 0; i < tabs.length; ++i) {
			let index = this._tabs[tabs[i]].indexOf(grid);
			if(index > -1){
				this._tabs[tabs[i]].splice(index, 1);
				console.log(this._tabs[tabs[i]]);
				GridStorage.customGrids = this._tabs[tabs[i]];
			}
		}
	}
}


class GridButton{

	private _domElement:HTMLElement;
	private _data:any;

	constructor(private _manager:GridManager,
				private _parentElement:HTMLElement,
		        private _callbackObject:any,
		        private _deletable:boolean = true){}

	private build = (data:any)=>{
		this._data = data;
		var tile:PolygonTile = new PolygonTile(new Point(0,0), new Point(10,10), data);
		tile.redraw();

		this.generateDomElement(tile, data);
	}

	private generateDomElement = (tile:PolygonTile, data:any)=>{

		var imageURL = tile.canvas.toDataURL();
		this._domElement = document.createElement("div");
		this._domElement.setAttribute("class", "grid-button");
		this._domElement.setAttribute("style", "background-image:url("+imageURL+");");

		if(this._deletable){
			this.generateDeleteButton();
		}

		let highlight = document.createElement("div");
		highlight.setAttribute("class", "highlight");
		this._domElement.appendChild(highlight);

		this._domElement.addEventListener("click", (e)=>{
			this._callbackObject.setGrid(data);
		});


		this._parentElement.appendChild(this._domElement);

	}

	private generateDeleteButton(){
		var deleteButton = document.createElement("div");
		deleteButton.setAttribute("class", "delete-button");
		this._domElement.appendChild(deleteButton);

		deleteButton.addEventListener("click", (e)=>{
			if(confirm("are you sure you want to delete this grid?")){
				this._parentElement.removeChild(this._domElement);
				this._manager.delete(this);
			}
		});

	}

	public fromFile(path:string, save:boolean = false){
		DomUtils.fetchJSONFile(path).
			then(data => {
				this.build(data);
				if(save) GridStorage.saveGrid(data);
			}).
			catch(error => console.log(path+": grid file not loaded", error));
	}

	public fromData(data:any){
		this.build(data);
	}

	public toJSON(){
		return this._data;
	}
}
