const errorHandler = (err, reducer, customMessage, customCode, fatal) => dispatch => {
    if(err) {
        console.log(err.message);

        if (err.response) {
            if (err.response.data) {
                console.log(err.response.data);

                return dispatch(reducer({
                    error: {
                        message: err.response.data.message || customMessage,
                        code: err.response.data.code,
                        fatal
                    }
                }));
            }
        }
    }    

    return dispatch(reducer({
        error: {
            message: customMessage,
            code: customCode,
            fatal
        }
    }));
};

export default errorHandler;