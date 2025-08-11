// Middleware bắt các request không khớp route nào
export const notFound = (req, res, next) => {
    const error = new Error(`Không tìm thấy route: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error); // Ném cho errorHandler xử lý
};
