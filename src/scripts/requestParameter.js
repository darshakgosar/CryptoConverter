// Add headers before triggering the backend
function requestParam(method, body) {
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    var parameters = {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
    }
    return parameters;
}

export { requestParam };