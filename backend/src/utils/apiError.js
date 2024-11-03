//since there is already a Error class in Node.JS so we are extending it.
class ApiError extends Error{
    constructor(
        statusCode,
        messege = "Something went wrong",
        errors = [],
        stack=""
    )
    {
        super(messege)
        this.statusCode = statusCode
        this.message = messege
        this.errors = errors
        this.success = false;
        this.data = null
        
        if (stack) {
           this.stack=stack
        }
        else {
            Error.captureStackTrace(this,this.constructor)
        }


    }
    
    
}
    
export {ApiError}