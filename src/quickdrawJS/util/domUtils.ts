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



// Prompt the user to select an image, calling the given function if the user
// makes a choice.
export function selectImage(): Promise<File> {
    // Construct a new file selector for images.
    const selector = document.createElement("input");
    selector.type = "file";
    selector.accept = "image/*";

    // Run the callback once a change occurs.
    return new Promise((resolve: (file: File) => void): void => {
        selector.addEventListener("change", function (): void {
            const image = this.files[0];

            // Check if a file was provided. Might be worth checking the type of
            // the file is an image in the future.
            if (image) {
                resolve(image);
            }
        });

        // Simulate a click on the input, triggering the prompt.
        selector.dispatchEvent(new MouseEvent("click"));
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