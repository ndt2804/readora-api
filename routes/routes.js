import routerUser from "./user.routes.js";
export default function route(app) {
    app.use("/api/v1", routerUser);
}
