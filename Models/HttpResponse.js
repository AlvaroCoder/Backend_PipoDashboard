class Response{
    getResponse(){
        return{
            error : this.error,
            status : this.statusCode,
            message : this.message
        }
    }
}
class ErrorResponse extends Response{
    constructor(){
        super();
        this.error = true;
        this.statusCode = 404;
    }
    getError(error = String){
        this.message = {"error":error} ;
        return this.getResponse()
    }
}
class SuccesResponse extends Response{
    constructor(){
        super();
        this.error = false;
        this.statusCode = 202;
        this.message = "Success"
    }
    getSuccess(message){
        if (message) {
            this.message = message
        }
        return this.getResponse();
    }
}
module.exports={ErrorResponse, SuccesResponse}