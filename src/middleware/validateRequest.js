const validateRequest = (schema, property) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property], { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                error: 'Validation Error',
                details: error.details.map((detail) => detail.message),
            });
        }
        next();
    };
};

module.exports = validateRequest;
