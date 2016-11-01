
export function editDomElementAttr(id:string, attr:string , value:any):void{
	document.getElementById(id).setAttribute(attr, value);
}

export function fetchJSONFile(path:string, callback:Function) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback){callback(data);}
            }
        }
    };
    httpRequest.open('GET', path, false);  
    httpRequest.send(); 
}

export function downloadTextAsFile(filename:string, text:string) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

export function loadFile(){
    

}
