const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // openAI errors
    if (err.response && err.response.status) {
        return res.status(err.response.status).json({
            success: false,
            error: 'Cannot communicate with openAI',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        })
    }

    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })

}

module.exports = errorHandler;