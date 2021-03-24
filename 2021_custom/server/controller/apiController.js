exports.apiTestFunc = async (req, res, next) => {
    try {
        res.status(200).json({hi : "hi"});
    } catch (error) {
        next(error)
    }
};
