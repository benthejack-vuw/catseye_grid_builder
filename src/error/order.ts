export default class OrderError extends Error {
    constructor(className:string, requirement: string, dependant: string) {
        super(`Before calling ${requirement} on ${className} call ${dependant}`);
    }
}