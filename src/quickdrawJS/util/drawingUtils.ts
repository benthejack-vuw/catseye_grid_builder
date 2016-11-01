export function grey(g:number): string{
	return "rgba("+g+", "+g+", "+g+", 1)";
};

export function greyA(g:number, a:number): string{
	return "rgba("+g+", "+g+", "+g+", "+a/255.0+")";
};

export function rgb(r:number, g:number, b:number){
	return "rgba("+r+", "+g+", "+b+", 1)";
};

export function rgba(r:number, g:number, b:number, a:number){
	return "rgba("+r+", "+g+", "+b+", "+a/255.0+")";
};

