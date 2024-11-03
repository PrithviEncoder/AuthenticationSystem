class ApiResponse {

    constructor(statusCode, data, message = 'Success') {
            this.statusCode = statusCode,
            this.data = data,//to access in frontend via api call reponse.data.data for axios
            this.message = message,
            this.success=statusCode<400
            
        
}


}

export {ApiResponse}