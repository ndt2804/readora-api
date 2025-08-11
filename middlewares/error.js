export const errorHandler = (err, req, res, next) => {
    // Lấy statusCode, mặc định 500
    const statusCode = err.statusCode || 500;

    // Ẩn stack trace trong production
    const isDev = process.env.NODE_ENV === "development";

    res.status(statusCode).json({
        success: false,
        message: err.message || "Có lỗi xảy ra trên server",
        errors: err.errors || [], // Nếu bạn custom thêm err.errors
        ...(isDev && { stack: err.stack })
    });
};
