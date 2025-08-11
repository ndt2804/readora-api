export const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Không tìm thấy route: ${req.originalUrl}`,
        errors: []
    });
};
