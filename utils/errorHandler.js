const errorHandler = (err, reducer, customMessage, customCode, fatal) => dispatch => {
    if (err) {
        console.log(err.message);

        if (err.response) {
            if (err.response.data) {
                console.log(err.response.data);

                dispatch(reducer({
                    error: {
                        message: err.response.data.message || customMessage,
                        code: err.response.data.code,
                        fatal
                    }
                }));

                return setTimeout(() => {
                    dispatch(reducer({
                        error: null
                    }));
                }, 1000);
            }
        }
    }

    dispatch(reducer({
        error: {
            message: customMessage,
            code: customCode,
            fatal
        }
    }));

    return setTimeout(() => {
        dispatch(reducer({
            error: null
        }));
    }, 1000);
};

export default errorHandler;