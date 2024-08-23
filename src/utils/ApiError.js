class ApiError extends Error{
    constructor(
        statusCode,
        message="SomeThong Went Wrong",
        errors=[],
        stact=""
    ){
        super(message)
        this.statusCode=statusCode
        this.message=message
        this.errors=errors
        this,success=false
        this.data=null

        if(stact){
            this.stack=stact
        }else{
            Error.captureStackTrace(this,this.constructor)
        }

    }
}

export {ApiError}