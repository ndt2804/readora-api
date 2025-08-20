import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",  // OpenAPI version
        info: {
            title: "My Express API",
            version: "1.0.0",
            description: "API documentation generated with swagger-jsdoc",
        },
        servers: [
            {
                url: "http://localhost:3000/api",
            },
        ],
    },
    // 👇 Chỉ định nơi swagger-jsdoc tìm JSDoc comment
    apis: ["./routes/*.js", "./models/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
