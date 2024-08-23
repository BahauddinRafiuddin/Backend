class ApiResopnse {
    constructor(
        statusCode,
        data = "SomeThong Went Wrong",
        message = "Success"
    ) {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResopnse }