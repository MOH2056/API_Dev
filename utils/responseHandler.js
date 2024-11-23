const sendResponse = (res, { message, status = 'Success', statusCode = 200, data = null }) => {
    const response = {
        message,
        status,
        status_code: statusCode,
    };

    if (data) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};
 export default sendResponse