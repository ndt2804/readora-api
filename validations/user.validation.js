import Joi from "joi";

export const createUserSchema = Joi.object({
    fullname: Joi.string().min(3).max(50).required(),
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net", "org", "io", "vn", "dev"] }
        })
        .required(),
    password: Joi.string()
        .pattern(new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{6,30}$"))
        .required()
        .messages({
            "string.pattern.base":
                "Mật khẩu phải có ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt"
        }),
    role: Joi.string().valid("user", "admin").default("user")
});
