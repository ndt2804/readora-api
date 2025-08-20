import { Router } from "express";
import { apiReference } from "@scalar/express-api-reference";
import { swaggerSpec } from "../libs/swagger.js";

const router = Router();

// Giao diện API Reference (Scalar UI)
router.use("/reference", apiReference({ spec: { content: swaggerSpec } }));

// Xuất raw OpenAPI JSON
router.get("/openapi.json", (req, res) => {
    res.json(swaggerSpec);
});

export default router;