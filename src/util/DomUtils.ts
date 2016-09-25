
export function editDomElementAttr(id:string, attr:string , value:any):void{
	document.getElementById(id).setAttribute(attr, value);
}
