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
    httpRequest.open('GET', path);  
    httpRequest.send(); 
}

export function dataURLfromImage(image:HTMLImageElement):string{
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(image,0,0);
    return canvas.toDataURL();
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



// Prompt the user to select an image, calling the given function if the user
// makes a choice.
export function selectImage(): Promise<File> {
    // Construct a new file selector for images.
    const selector = document.createElement("input");
    selector.type = "file";
    selector.accept = "image/*";
    selector.setAttribute("style", "display:none;");
    document.body.appendChild(selector);

    // Run the callback once a change occurs.
    return new Promise((resolve: (file: File) => void): void => {
        selector.addEventListener("change", ()=>{
            const image = selector.files[0];

            // Check if a file was provided. Might be worth checking the type of
            // the file is an image in the future.
            if (image) {
                resolve(image);
                document.body.removeChild(selector);
            }
        });

        // Simulate a click on the input, triggering the prompt.
        selector.dispatchEvent(new MouseEvent("click"));
    });
}

// Prompt the user to select an image, calling the given function if the user
// makes a choice.
export function selectFile(): Promise<File> {
    // Construct a new file selector for images.
    const selector = document.createElement("input");
    selector.type = "file";
    selector.setAttribute("style", "display:none;");
    document.body.appendChild(selector);
    // Run the callback once a change occurs.
    return new Promise((resolve: (file: File) => void): void => {
        selector.addEventListener("change", function (): void {
            const file = this.files[0];

            // Check if a file was provided. Might be worth checking the type of
            // the file is an image in the future.
            if (file) {
                resolve(file);
                document.body.removeChild(selector);
            }
        });

        // Simulate a click on the input, triggering the prompt.
        selector.dispatchEvent(new MouseEvent("click"));
    });
}

// Read the given image file into an image element.
export function readFileAsJSON(file: File): Promise<string> {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();

        // Run the callback once the file is successfully loaded.
        reader.addEventListener("load", () => resolve(JSON.parse(reader.result)));

        // Reject with the error if the load fails.
        reader.addEventListener("error", reject);

        // Read the file as a URL.
        reader.readAsText(file);
    });
}

// Read the given image file into an image element.
export function readImageAsURL(file: File): Promise<string> {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();

        // Run the callback once the file is successfully loaded.
        reader.addEventListener("load", () => resolve(reader.result));

        // Reject with the error if the load fails.
        reader.addEventListener("error", reject);

        // Read the file as a URL.
        reader.readAsDataURL(file);
    });
}

// Load the image at the given URL, returning the resulting image to the
// callback once the load completes.
export function buildImageFromURL(url: string): Promise<HTMLImageElement> {
    return new Promise(function (resolve, reject) {
        const image = document.createElement("img");

        // Resolve with the image once the load completes.
        image.addEventListener("load", () => resolve(image));

        // Reject with the error if the load fails.
        image.addEventListener("error", reject);

        // Trigger the load.
        image.src = url;
    });
}


function dataURLtoBlob(dataUrl:any) {
    var arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

export function downloadCanvasImage(canvas:HTMLCanvasElement, name:string, type?:string){
      var link = document.createElement("a") as
        HTMLAnchorElement & { download: string };

      var mime = type === undefined ? "image/jpeg" : "image/"+type;
      var imgData = canvas.toDataURL(mime);
      var strDataURI = imgData.substr(22, imgData.length);
      var blob = dataURLtoBlob(imgData);
      var objurl = URL.createObjectURL(blob);

      link.download = type !== undefined ? name+"."+type : name+".jpeg";

      link.href = objurl;

      link.click();
}