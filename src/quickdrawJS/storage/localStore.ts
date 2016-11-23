export function storeJSON(name:string, data:any){
	store(name, JSON.stringify(data));
}

export function store(name:string, data:string){
	try {
        if (supported()) {
            // Remove the old image, in case the storage fails.
            delete localStorage[name];
            // Save the information as a JSON string.
            localStorage[name] = data;
        } else {
            alert("Failed to store the data: " +
                "your browser doesn't support local storage.\n\n" +
                "You can continue as normal, but be aware that your work " +
                "will not be saved if the page is closed.");
        }
    } catch (error) {
        alert("Failed to store the data: it's either too big, or you're out of space.\n\n" +
            "You can continue as normal, but be aware that your work " +
            "will not be saved if the page is closed.");
    }
}

export function getJSON(name:string){
	if (supported() && contains(name)) {
		return JSON.parse(localStorage[name]);
	}
}

export function get(name:string){
	if (supported() && contains(name)) {
		return localStorage[name];
	}
}

export function remove(name:string){
	if (supported() && contains(name)) {
		delete localStorage[name];
	}
}

export function contains(name:string):boolean{
	if (supported()) {
        return typeof localStorage[name] === "object" || typeof localStorage[name] === "string";
    } 
}

export function clearAll(){
    if (supported()) {
      localStorage.clear();  
    } 
}

export function supported():boolean{
	return typeof localStorage === "object";
}
