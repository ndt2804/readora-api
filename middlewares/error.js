// Middleware xử lý lỗi toàn cục
export const errorHandler = (err, req, res, next) => {
    console.error("❌ Error:", err);

    // Nếu là lỗi đã xác định
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        // Chỉ show stack trace khi đang ở môi trường development
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
};
