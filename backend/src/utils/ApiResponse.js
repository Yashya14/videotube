// This class is used to create a standard response object for API responses.
// It helps you send consistent success responses from your backend.
// You can set the status code, data, and a message. The 'success' property is true if statusCode is less than 400.

class ApiResponse{
    constructor(
        statusCode,           // HTTP status code (like 200, 201, etc.)
        data,                 // The main data you want to send in the response
        message = "Success",  // Optional message (default is "Success")
    ){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400; // true for success, false for errors
    }
}

export { ApiResponse };