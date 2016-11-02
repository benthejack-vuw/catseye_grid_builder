// Errors for not overriding required methods.
export default class OverrideError extends Error {
    constructor(parentClass:string, object: any, method: string) {

    	//NEED A TIDIER WAY TO FIND CLASSNAME
	  	var funcNameRegex = /function (.{1,})\(/;
	   	var className = (funcNameRegex).exec(object.constructor.toString());
	
        super(`you must override the ${method} method of ${parentClass} in ${className}`);
    }
}
